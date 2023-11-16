// 201935312 이수현 - purchase.js

var db = require('./db');

function authIsOwner(req, res){
    if(req.session.is_logined){return true}
    else{return false}
}

module.exports = {

    home : (req, res) => {
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        var sql2 = `
                    SELECT purchase.*, merchandise.image as img, merchandise.name as name
                    FROM purchase
                    INNER JOIN merchandise ON purchase.mer_id = merchandise.mer_id
                    WHERE purchase.loginid = ${req.session.loginid}
                    ORDER BY purchase.date DESC;
                `;
        db.query(sql1 + sql2, (err, results)=>{
            var context;
            if(isOwner){
                if(req.session.class == '00'){
                    context = {
                        menu: "menuForCeo.ejs",
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        purchases : results[1],
                    }
                } else if (req.session.class === '01') {
                    context = {
                        menu: "menuForManager.ejs",
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        purchases : results[1],

                    };
                } else if (req.session.class === '02') {
                    context = {
                        menu: "menuForCustomer.ejs",
                        who: req.session.name,
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        body: 'purchase.ejs',
                        purchases : results[1],
                    };
                }
            }
            req.app.render('home', context, (err, html) => {
                if(err){console.log(err)}
                res.end(html);
            }); 
        })
    }, // end of home



    detail : (req, res)=>{
        var mer_id = req.params.merId;
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        var sql2 = `select * from merchandise where mer_id = ${mer_id};`
        db.query(sql1 + sql2, (err, results)=>{
            var context;
            if(isOwner){
                if(req.session.class == '00'){
                    context = {
                        menu: "menuForCeo.ejs",
                        who: req.session.name,
                        body: 'purchaseC.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1][0],
                    }
                }else if (req.session.class === '01') {
                    context = {
                        menu: "menuForManager.ejs",
                        who: req.session.name,
                        body: 'purchaseC.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1][0],

                    };
                } else if (req.session.class === '02') {
                    context = {
                        menu: "menuForCustomer.ejs",
                        who: req.session.name,
                        body: 'purchaseC.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1][0],
                    };
                }
            }
            else{
                context = {
                    menu: "menuForCustomer.ejs",
                    who: '손님',
                    body: 'purchaseC.ejs',
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    merchandise : results[1][0],
                };
            }
            req.app.render('home', context, (err, html) => {
                res.end(html);
            });

        })
    }, // end of detail 


    purchase_process : (req, res)=>{
        var post = req.body; 
        var isOwner = authIsOwner(req, res);
        var sql1 ;
        var sql2 ;
        console.log(post)
        if (isOwner) {

            // cart에서 구매 했을 때
            if (post.cart === 'true') {
                var length = Number(post.length)
                for (var i = 0; i < length; i++) {
                    const merId = post[`mer_id[${i}]`];
                    const price = post[`price[${i}]`];
                    const qty = post[`qty[${i}]`];
            
                    sql1 = `insert into purchase (loginid, mer_id, date, price, point, qty, total) 
                                values(${req.session.loginid}, ${merId}, now(), ${price}, ${price * 0.5}, ${qty}, ${price * qty})`;
                    db.query(sql1, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }

                sql2 = `delete from cart where loginid = ${req.session.loginid}`;
                db.query(sql2, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            // 바로 구매했을 때 
            else{
                sql1 = `insert into purchase (loginid, mer_id, date, price, point, qty, total) 
                                values(${req.session.loginid}, ${post.mer_id}, now(), ${post.price}, ${post.price * 0.5}, ${post.qty}, ${post.price * post.qty})`;
                db.query(sql1, (err, results) => {
                    if (err) {
                        console.log(err);
                    } 
                });
            }
    
            res.writeHead(302, { Location: '/purchase' });
            res.end();
        }
    }, // end of purchase_process

    cart : (req, res)=>{
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        var sql2 = `
                    SELECT cart.*, merchandise.*
                    FROM cart
                    INNER JOIN merchandise ON cart.mer_id = merchandise.mer_id
                    WHERE cart.loginid = '${req.session.loginid}';
                `;
        db.query(sql1 + sql2, (err, results)=>{
            var context;
            if(isOwner){
                if(req.session.class == '00'){
                    context = {
                        menu: "menuForCeo.ejs",
                        who: req.session.name,
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        body: 'cart.ejs',
                        carts : results[1],
                    }
                }else if (req.session.class === '01') {
                    context = {
                        menu: "menuForManager.ejs",
                        who: req.session.name,
                        boardtypes : results[0],
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        body: 'purchaseC.ejs',
                        body: 'cart.ejs',
                        carts : results[1],

                    };
                } else if (req.session.class === '02') {
                    context = {
                        menu: "menuForCustomer.ejs",
                        who: req.session.name,
                        boardtypes : results[0],
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        body: 'purchaseC.ejs',
                        body: 'cart.ejs',
                        carts : results[1],
                    };
                }
            }
            console.log("cart : ", context)
            req.app.render('home', context, (err, html) => {
                res.end(html);
            });

        })

    }, // end of cart

    cart_process : (req, res)=>{
        var mer_id = req.params.mer_id;
        var isOwner = authIsOwner(req, res);
        var sql1 = `insert into cart (loginid, mer_id, date) 
                    values(${req.session.loginid}, ${mer_id}, now())`
        if(isOwner){
            db.query(sql1, (err,results)=>{
                if(err){console.log(err)}
                else{
                    console.log(results)
                    res.writeHead(302, {Location: '/purchase/cart'});
                    res.end();
                }
            })
        }
    }, // end of cart_process

    cancel_process : (req, res) =>{
        var pur_id = req.params.pur_id;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var sql1 = `update purchase set cancel = 'Y' where purchase_id = ${pur_id};`
            db.query(sql1, (err, results)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/purchase'});
                    res.end();
                }
            })
        }
    }, // end of cancel_process
}
