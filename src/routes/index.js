var express = require('express');
var router = express.Router();
const homeController = require('../controllers/adminController/homeController')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/home', homeController.home)
// router.get('/home', (req, res)=>{
//     return res.render('admin/index')
// })

module.exports = router;
