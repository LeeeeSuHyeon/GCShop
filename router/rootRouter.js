// 201935312 이수현 router/rootRouter.js

const express = require('express');
var router = express.Router()

var shop = require('../lib/shop');


router.get('/',(req, res)=>{

    shop.home(req, res);
}); 


router.get('/shop/all',(req, res)=>{

    shop.home(req, res);
}); 

module.exports = router;

