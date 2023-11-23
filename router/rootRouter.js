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

// 검색 
router.post('/shop/search',(req, res)=>{
    shop.search(req, res);
}); 


router.get('/shop/detail/:merId',(req, res)=>{

    shop.detail(req, res);
}); 


router.get('/shop/anal/customer',(req, res)=>{

    shop.customeranal(req, res);
}); 



module.exports = router;

