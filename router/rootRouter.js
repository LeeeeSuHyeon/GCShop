// 201935312 이수현 router/rootRouter.js

const express = require('express');
var router = express.Router()

var shop = require('../lib/shop');


router.get('/',(req, res)=>{

    shop.home(req, res);
}); 


router.get('/shop/:category',(req, res)=>{

    shop.home(req, res);
}); 

router.get('/shop/detail/:merId',(req, res)=>{

    shop.detail(req, res);
}); 
module.exports = router;

