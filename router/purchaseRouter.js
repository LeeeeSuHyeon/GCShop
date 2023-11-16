// 201935312 이수현 router/purchaseRouter.js

const express = require('express');
var router = express.Router()

var purchase = require('../lib/purchase');

router.get('/',(req, res)=>{
    purchase.home(req, res);
}); 

router.get('/detail/:merId',(req, res)=>{
    purchase.detail(req, res);
}); 

router.post('/purchase_process',(req, res)=>{
    purchase.purchase_process(req, res);
}); 


module.exports = router;