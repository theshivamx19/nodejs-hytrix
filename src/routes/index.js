var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Admin:Admin123@cluster0.ngpjs.mongodb.net/my_panel_db', {
  useNewUrlParser : true,
})
.then(()=>console.log('MongoDb connected'))
.catch((err)=>console.log(err.message))

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
