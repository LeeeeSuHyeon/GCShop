// 201935312 이수현 lib/shop.js

var db = require('./db');

function authIsOwner(req, res){
    if(req.session.is_logined){return true}
    else{return false}
}

module.exports = {
    home: (req, res) => {
        var isOwner = authIsOwner(req, res);
        var category = req.params.category;
        var sql1 = `select * from boardtype;`
        
        // category에 따른 merchandise 분류
        if(category === "all" || category === undefined){
            var sql2 = `select * from merchandise;`
        }
        else{
            var sql2 = `select * from merchandise where category = ${category};`
        }
        db.query(sql1 + sql2, (err, results) => {
            var context;
        
            if (isOwner) {
                // class에 따른 context 변경 
                if (req.session.class === '00') {
                    context = {
                        menu: "menuForMIS.ejs",
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1],
                        update : 'NO'
                    };
                } else if (req.session.class === '01') {
                    context = {
                        menu: "menuForManager.ejs",
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1],
                        update : 'NO'

                    };
                } else if (req.session.class === '02') {
                    context = {
                        menu: "menuForCustomer.ejs",
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1],
                        update : 'NO'
                    };
                }
            } else {
                context = {
                    menu: "menuForCustomer.ejs",
                    who: '손님',
                    body: 'merchandise.ejs',
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    merchandise : results[1],
                    update : 'NO'
                };
            }

            req.app.render('home', context, (err, html) => {
                res.end(html);
            });
        });
        
    }, // end of home

    search : (req, res)=>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        var sql2 = `select * from merchandise where name like '%${post.search}%' or brand like '%${post.search}%' or supplier like '%${post.search}%'`
        
        db.query(sql1 + sql2, (err, results)=>{
            var context;
            if(isOwner){
                if(req.session.class == '00'){
                    context = {
                        menu: "menuForMIS.ejs",
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1],
                        update : 'NO'
                    }
                }else if (req.session.class === '01') {
                    context = {
                        menu: "menuForManager.ejs",
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1],
                        update : 'NO'

                    };
                } else if (req.session.class === '02') {
                    context = {
                        menu: "menuForCustomer.ejs",
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1],
                        update : 'NO'
                    };
                }
            } else {
                context = {
                    menu: "menuForCustomer.ejs",
                    who: '손님',
                    body: 'merchandise.ejs',
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    merchandise : results[1],
                    update : 'NO'
                };
            }

            req.app.render('home', context, (err, html) => {
                res.end(html);
            });
        })
        
    }, // end of search 

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
                        menu: "menuForMIS.ejs",
                        who: req.session.name,
                        body: 'detail_mer.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1][0],
                    }
                }else if (req.session.class === '01') {
                    context = {
                        menu: "menuForManager.ejs",
                        who: req.session.name,
                        body: 'detail_mer.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        merchandise : results[1][0],

                    };
                } else if (req.session.class === '02') {
                    context = {
                        menu: "menuForCustomer.ejs",
                        who: req.session.name,
                        body: 'detail_mer.ejs',
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
                    body: 'detail_mer.ejs',
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

    customeranal : (req, res)=>{
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            if(req.session.class === '00'){
                var sql1 = `select * from boardtype;`
                var sql2 = `select address,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate
                        from person group by address;`
            db.query(sql1 + sql2,(error,results)=>{
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu : 'menuForMIS.ejs',
                    body : 'customerAnal.ejs',
                    /*********** menuForMIS.ejs에 필요한 변수 ***********/ 
                    who : req.session.name,
                    logined : 'YES',
                    boardtypes : results[0],
                    /*********** customerAnal.ejs에 필요한 변수 ***********/ 
                    percentage : results[1]
                };
                req.app.render('home',context, (err, html)=>{
                    res.end(html); })
                });
            }
        }
        else{
            var sql1 = `select * from boardtype;` ; 
            var sql2 = `select * from merchandise;`;
            db.query(sql1 + sql2,(error,results)=>{
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu : 'menuForCustomer.ejs',
                    body : 'merchandise.ejs',
                    /*********** menuForCustomer.ejs에 필요한 변수 ***********/ 
                    who : '손님',
                    logined : 'NO',
                    boardtypes : results[0],
                    /*********** mechandise.ejs에 필요한 변수 ***********/ 
                    merchandise : results[1],
                    vu : 'v'
                };
                req.app.render('home',context, (err, html)=>{ 
                    res.end(html); 
                })
        }); }
        
    }, // end of customeranl
}
