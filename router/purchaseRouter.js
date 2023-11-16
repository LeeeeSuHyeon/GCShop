// 201935312 이수현 router/purchaseRouter.js

const express = require('express');
var router = express.Router()

var purchase = require('../lib/purchase');

// ==================================================
// purchase
router.get('/purchase/:vu',(req, res)=>{
    purchase.home(req, res);
}); 

router.get('/detail/:merId',(req, res)=>{
    purchase.detail(req, res);
}); 

router.post('/purchase_process',(req, res)=>{
    purchase.purchase_process(req, res);
}); 

router.get('/create',(req, res)=>{
    purchase.create(req, res);
}); 

router.post('/create_process', (req, res)=>{
    purchase.create_process(req, res);
}); 

router.get('/update/:p_id',(req, res)=>{
    purchase.update(req, res);
}); 

router.post('/update_process', (req, res)=>{
    purchase.update_process(req, res);
}); 


router.get('/delete_process/:p_id',(req, res)=>{
    purchase.delete_process(req, res);
}); 

// ==================================================
// cart

router.get('/cart/:vu',(req, res)=>{
    purchase.cart(req, res);
}); 


router.get('/cart_process/:mer_id',(req, res)=>{
    purchase.cart_process(req, res);
}); 

router.get('/cancel/:pur_id',(req, res)=>{
    purchase.cancel_process(req, res);
}); 

router.get('/cart_create',(req, res)=>{
    purchase.cart_create(req, res);
}); 

router.post('/cart_create_process', (req, res)=>{
    purchase.cart_create_process(req, res);
}); 

router.get('/cart/update/:cart_id',(req, res)=>{
    purchase.cart_update(req, res);
}); 

router.post('/cart_update_process', (req, res)=>{
    purchase.cart_update_process(req, res);
}); 


router.get('/cart/delete_process/:cart_id',(req, res)=>{
    purchase.cart_delete_process(req, res);
}); 



module.exports = router;