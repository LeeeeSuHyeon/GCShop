// 201935312 이수현 lib/shop.js

var db = require('./db');

function authIsOwner(req, res){
    if(req.session.is_logined){return true}
    else{return false}
}

module.exports = {
    home: (req, res) => {
        var isOwner = authIsOwner(req, res);
        db.query("select * from merchandise", (err, results) => {
            var context;
            if (isOwner) {
                // class에 따른 context 변경 
                if (req.session.class === '00') {
                    context = {
                        menu: "menuForCeo.ejs",
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        merchandise : results,
                        update : 'NO'
                    };
                } else if (req.session.class === '01') {
                    context = {
                        menu: "menuForManager.ejs",
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        merchandise : results,
                        update : 'NO'

                    };
                } else if (req.session.class === '02') {
                    context = {
                        menu: "menuForCustomer.ejs",
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: req.session.is_logined ? 'YES' : 'NO',
                        merchandise : results,
                        update : 'NO'
                    };
                }
            } else {
                context = {
                    menu: "menuForCustomer.ejs",
                    who: '손님',
                    body: 'merchandise.ejs',
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    merchandise : results,
                    update : 'NO'
                };
            }

            req.app.render('home', context, (err, html) => {
                res.end(html);
            });
        });
    }
}
