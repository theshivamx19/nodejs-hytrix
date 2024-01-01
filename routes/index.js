var express = require('express');
var router = express.Router();
const userModel = require('./users')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://Admin:Admin123@cluster0.ngpjs.mongodb.net/testing', {
    useNewUrlParser:true
})
.then(()=>console.log('MongoDb connected successfully'))
.catch(err => console.log(err))


/* GET home page. */
router.get('/', function (req, res) {
  res.render('index')
})
router.post('/create', async function (req, res, next) {
  const data = req.body
  const { name, email, phone, password, address } = data
  const user = await userModel.create({
    name: name,
    email: email,
    phone: phone,
    password: password,
    address: address
  })
  res.send(user)
});



router.get('/login-page', function (req, res) {
  return res.render('login')
})

const authentication = function (req, res, next) {
  const token = req.cookies['x-api-key']
  // console.log(token);
  if (!token) {
    return res.status(400).send({ status: false, message: 'Token must be present' })
  }
  jwt.verify(token, 'secretkey', function (err, decodedToken) {
    if (err) {
      return res.status(401).send({ status: false, message: 'User is unauthenticated' })
    }
    req.tokenUserId = decodedToken.userId
    next()
  })
}

router.post('/user-login', async function (req, res) {
  const data = req.body
  const { email, password } = data
  const checkUser = await userModel.findOne({ email, password })
  if (!checkUser) {
    return res.status(404).send({ status: false, message: 'User not found' })
  }
  const token = jwt.sign({
    userId: checkUser._id
  }, 'secretkey')
  res.cookie('x-api-key', token)
  // console.log(req.headers);
  return res.status(200).render('dashboard',{ status: true, message: "Logged In successfull", data: token })
})

router.get('/get-users', authentication, async function (req, res) {
  const users = await userModel.find()
  res.render('userList', userData = users)
})


router.get('/delete-user/:id', async function(req, res){
  try {
  const userId = req.params.id
  // console.log(userId);
  if(!userId){
    return res.status(400).send({status : false, message : "User id is required"})
  }
  const checkUser = await userModel.findOne({_id : userId})
  // console.log(checkUser);
  if(!checkUser){
    return res.status(404).send({status : false, message : 'No such user exists'})
  }
  const deletedUser = await userModel.findByIdAndDelete({_id : userId})
  // console.log(deletedUser);
  return res.status(200).redirect('/get-users')
  // return res.status(200).send({status : true, message : "User deleted successfully", data : deletedUser})
  }
  catch(err){
    return res.status(500).send({status:false, message : err.message})
  }
})

module.exports = router;
