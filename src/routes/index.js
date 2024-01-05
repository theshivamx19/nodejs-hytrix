var express = require('express');
var router = express.Router();
const homeController = require('../controllers/adminController/homeController')


router.get('/dashboard', homeController.dashboard)

module.exports = router;
