// 201935312 이수현 - purchase.js

var db = require('./db');
const merchandise = require('./merchandise');

function authIsOwner(req, res){
    if(req.session.is_logined){return true}
    else{return false}
}

module.exports = {

    home : (req, res) => {
        var vu = req.params.vu;
        
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        var sql2 = `
                    SELECT purchase.*, merchandise.image as img, merchandise.name as name
                    FROM purchase
                    INNER JOIN merchandise ON purchase.mer_id = merchandise.mer_id
                    WHERE purchase.loginid = ${req.session.loginid}
                    ORDER BY purchase.date DESC;
                `;
        var sql3 = `
                SELECT purchase.*, merchandise.image as img, merchandise.name as name
                FROM purchase
                INNER JOIN merchandise ON purchase.mer_id = merchandise.mer_id
                ORDER BY purchase.loginid;
            `;
        db.query(sql1 + sql2 + sql3, (err, results)=>{
            var context;
            if(isOwner){
                if(vu === 'v'){
                    if(req.session.class == '00'){
                        context = {
                            menu: "menuForCeo.ejs",
                            who: req.session.name,
                            body: 'purchase.ejs',
                            logined: req.session.is_logined ? 'YES' : 'NO',
                            boardtypes : results[0],
                            purchases : results[1],
                            userClass : req.session.class,
                            update : 'N',
                        }
                    } else if (req.session.class === '01') {
                        context = {
                            menu: "menuForManager.ejs",
                            who: req.session.name,
                            body: 'purchase.ejs',
                            logined: req.session.is_logined ? 'YES' : 'NO',
                            boardtypes : results[0],
                            purchases : results[2],
                            userClass : req.session.class,
                            update : 'N',
    
                        };
                    } else if (req.session.class === '02') {
                        context = {
                            menu: "menuForCustomer.ejs",
                            who: req.session.name,
                            logined: req.session.is_logined ? 'YES' : 'NO',
                            boardtypes : results[0],
                            body: 'purchase.ejs',
                            purchases : results[1],
                            userClass : req.session.class,
                            update : 'N',
                        };
                    }
                }
                else if(vu === 'u'){
                    if (req.session.class === '01') {
                        context = {
                            menu: "menuForManager.ejs",
                            who: req.session.name,
                            body: 'purchase.ejs',
                            logined: req.session.is_logined ? 'YES' : 'NO',
                            boardtypes : results[0],
                            purchases : results[2],
                            userClass : req.session.class,
                            update : 'Y',
                        };
                    }
                    else{
                        res.send("<script>alert('권한이 없습니다.'); history.back();</script>");
                        return;
                    }
                }
            }
            else{
                res.send("<script>alert('로그인 후 이용 가능합니다.'); history.back();</script>");
                return;
            }
            req.app.render('home', context, (err, html) => {
                if(err){console.log(err)}
                res.end(html);
            }); 
        })
    }, // end of home

    create : (req, res)=>{
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        db.query(sql1, (err, results)=>{
            if(isOwner){
                var context = {
                    menu: "menuForManager.ejs",
                    who: req.session.name,
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    body: 'purchaseCU.ejs',
                    purchase: null,
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })                
            }
        })
        
    }, // end of create (purchase)

    create_process : (req, res) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        db.query(`select * from merchandise where mer_id = ${post.mer_id}`, (err, merchandise)=>{
            if(merchandise.length > 0 ){
                if(isOwner){
                    var sql1 = `insert into purchase (loginid, mer_id, date, price, point, qty, total) 
                                values(${post.loginid},${post.mer_id},'${post.date}', ${merchandise[0].price}, ${merchandise[0].price * 0.05}, ${post.qty}, ${merchandise[0].price * post.qty})`
                    db.query(sql1, (err, result)=>{
                        if(err){console.log(err)}
                        else{
                            res.writeHead(302, {Location: '/purchase/purchase/u'});
                            res.end();
                        }
                    })
                }
            }
            else{
                res.send("<script>alert('없는 상품 아이디입니다.'); history.back();</script>");
                return;
            }
        })
        
    }, //end of cart_create_process

    update : (req, res)=>{
        var p_id = req.params.p_id;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var sql1 = `select * from boardtype;`
            var sql2 = `
                        SELECT purchase.*, merchandise.image as img, merchandise.name as name
                        FROM purchase
                        INNER JOIN merchandise ON purchase.mer_id = merchandise.mer_id
                        WHERE purchase.purchase_id = ${p_id}
                    `;
            db.query(sql1+sql2, (err, results)=>{
                if(err){console.log(err)}
                var context = {
                    menu: "menuForManager.ejs",
                    who: req.session.name,
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    body: 'purchaseCU.ejs',
                    purchase: results[1][0],
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            })
        }
    }, // end of update (purchase)

    update_process : (req, res) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        db.query(`select * from merchandise where mer_id = ${post.mer_id}`, (err, merchandise)=>{
            if(merchandise.length > 0 ){
                if(isOwner){
                    db.query('update purchase set loginid = ?,  mer_id= ?, date = ?, price = ?, point = ?, qty = ?, total = ? where purchase_id = ?',
                    [post.loginid, post.mer_id, post.date, merchandise[0].price, (merchandise[0].price * 0.05), post.qty, (merchandise[0].price * post.qty), post.p_id], (err, results)=>{
                        if(err){console.log(err)}
                        else{
                            res.writeHead(302, {Location: '/purchase/purchase/u'});
                            res.end();
                        }
                        
                    })
                }
            }
        })
    }, //end of update_process

    delete_process : (req, res)=>{
        var p_id = req.params.p_id;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var sql1 = `delete from purchase where purchase_id = ${p_id};`
            db.query(sql1, (err, results)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/purchase/purchase/u'});
                    res.end();
                }
            })
        }
    }, //end of delete_process



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
        if (isOwner) {

            // cart에서 구매 했을 때
            if (post.cart === 'true') {
                var length = Number(post.length)
                for (var i = 0; i < length; i++) {
                    const merId = post[`mer_id[${i}]`];
                    const price = post[`price[${i}]`];
                    const qty = post[`qty[${i}]`];
            
                    sql1 = `insert into purchase (loginid, mer_id, date, price, point, qty, total) 
                                values(${req.session.loginid}, ${merId}, now(), ${price}, ${price * 0.05}, ${qty}, ${price * qty})`;
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
                                values(${req.session.loginid}, ${post.mer_id}, now(), ${post.price}, ${post.price * 0.05}, ${post.qty}, ${post.price * post.qty})`;
                db.query(sql1, (err, results) => {
                    if (err) {
                        console.log(err);
                    } 
                });
            }
    
            res.writeHead(302, { Location: '/purchase/purchase/v' });
            res.end();
        }
    }, // end of purchase_process

    cart : (req, res)=>{
        var vu = req.params.vu;

        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        var sql2 = `
                    SELECT cart.*, merchandise.*
                    FROM cart
                    INNER JOIN merchandise ON cart.mer_id = merchandise.mer_id
                    WHERE cart.loginid = '${req.session.loginid}';
                `;
        var sql3 = `SELECT cart.*, merchandise.*
                    FROM cart
                    INNER JOIN merchandise ON cart.mer_id = merchandise.mer_id
                    ORDER BY loginid
                    ;`
        db.query(sql1 + sql2 + sql3, (err, results)=>{
            var context;
            if(isOwner){
                if(vu === 'v'){
                    if(req.session.class == '00'){
                        context = {
                            menu: "menuForCeo.ejs",
                            who: req.session.name,
                            logined: req.session.is_logined ? 'YES' : 'NO',
                            boardtypes : results[0],
                            body: 'cart.ejs',
                            carts : results[1],
                            userClass : req.session.class,
                            update : 'N',
                        }
                    }else if (req.session.class === '01') {
                        context = {
                            menu: "menuForManager.ejs",
                            who: req.session.name,
                            boardtypes : results[0],
                            logined: req.session.is_logined ? 'YES' : 'NO',
                            body: 'cart.ejs',
                            carts : results[2],
                            userClass : req.session.class,
                            update : 'N',
    
                        };
                    } else if (req.session.class === '02') {
                        context = {
                            menu: "menuForCustomer.ejs",
                            who: req.session.name,
                            boardtypes : results[0],
                            logined: req.session.is_logined ? 'YES' : 'NO',
                            body: 'cart.ejs',
                            carts : results[1],
                            userClass : req.session.class,
                            update : 'N',
                        };
                    }
                }
                else if(vu === 'u'){
                    if (req.session.class === '01') {
                        context = {
                            menu: "menuForManager.ejs",
                            who: req.session.name,
                            boardtypes : results[0],
                            logined: req.session.is_logined ? 'YES' : 'NO',
                            body: 'cart.ejs',
                            carts : results[2],
                            userClass : req.session.class,
                            update : 'Y',
                        };
                    }
                    else{
                        res.send("<script>alert('권한이 없습니다.'); history.back();</script>");
                        return;
                    }
                }
    
                
            }
            else{
                res.send("<script>alert('로그인 후 이용 가능합니다.'); history.back();</script>");
                return;
            }
            res.render('home', context, (err, html) => {
                if(err){
                    console.log(err);
                }
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
                    res.writeHead(302, {Location: '/purchase/cart/v'});
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
                    res.writeHead(302, {Location: '/purchase/purchase/v'});
                    res.end();
                }
            })
        }
    }, // end of cancel_process


    cart_create : (req, res) =>{
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        db.query(sql1, (err, results)=>{
            if(isOwner){
                var context = {
                    menu: "menuForManager.ejs",
                    who: req.session.name,
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    body: 'cartCU.ejs',
                    cart: null,
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })                
            }
        })
    }, // end of cart_create

    cart_create_process : (req, res) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var sql1 = `insert into cart (loginid, mer_id, date) values(${post.loginid},${post.mer_id},'${post.date}')`
            db.query(sql1, (err, result)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/purchase/cart/u'});
                    res.end();
                }
            })
        }
    }, //end of cart_create_process

    cart_update : (req, res) =>{
        var cart_id = req.params.cart_id;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var sql1 = `select * from boardtype;`
            var sql2 = `select * from cart where cart_id = ${cart_id};`
            db.query(sql1+sql2, (err, results)=>{
                if(err){console.log(err)}
                var context = {
                    menu: "menuForManager.ejs",
                    who: req.session.name,
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    body: 'cartCU.ejs',
                    cart: results[1][0],
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            })
        }

    }, // end of cart_update

    cart_update_process : (req, res)=>{
        var post = req.body;
        console.log(post)
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query(`update cart set loginid = ${post.loginid}, mer_id = ${post.mer_id}, date = '${post.date}'  where cart_id = ${post.cart_id}`,(err, result)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/purchase/cart/u'});
                    res.end();
                }
            })
        }
    }, // end of car_update_process

    cart_delete_process : (req, res)=>{
        var cart_id = req.params.cart_id;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var sql1 = `delete from cart where cart_id = ${cart_id};`
            db.query(sql1, (err, results)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/purchase/cart/u'});
                    res.end();
                }
            })
        }
    }
}
