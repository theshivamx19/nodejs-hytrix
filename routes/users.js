var express = require('express');
// var router = express.Router();
const mongoose = require('mongoose')

// mongoose.connect("mongodb://127.0.0.1:27017/testing")
// .then(()=>console.log('Mongodb Connected'))
// .catch(err => console.log(err.message))


const userSchema = mongoose.Schema({
  name : String,
  email : String,
  phone : String,
  password : String,
  address : String,
  createdAt : {
    type : Date,
    default : Date.now()
  }
  
})

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = mongoose.model('User', userSchema)
// module.exports = router;
