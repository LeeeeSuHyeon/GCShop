// 201935312 이수현 - person.js

var db = require('./db');

function authIsOwner(req, res){
    if(req.session.is_logined){return true}
    else{return false}
}

module.exports = {
    view : (req,res)=>{
        var vu = req.params.vu; // v 

        if (vu === "v"){
            var isOwner = authIsOwner(req, res);
            var sql1 = `select * from boardtype;`
            var sql2 = `select * from person;`

            db.query(sql1+sql2, (err, results)=>{
                if(isOwner){
                    var context = {
                        menu : "menuForManager.ejs",
                        who : req.session.name,
                        body : 'person.ejs',
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        persons : results[1],
                        update : 'NO'
                    };
                 }
        
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            })
        }
        else if(vu === "u"){
            var isOwner = authIsOwner(req, res);
            var sql1 = `select * from boardtype;`
            var sql2 = `select * from person;`

            db.query(sql1+sql2, (err, results)=>{
                if(isOwner){
                    var context = {
                        menu : "menuForManager.ejs",
                        who : req.session.name,
                        body : 'person.ejs',
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        persons : results[1],
                        update : 'YES'
                    };
                 }
        
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            })
        }
    }, // end of view

    create : (req, res) =>{
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        db.query(sql1, (err, results)=>{
            if(isOwner){
                var context = {
                    menu: "menuForManager.ejs",
                    who: req.session.name,
                    body: 'personCU.ejs',
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results,
                    person: null,
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            }
        })
    }, // end of create

    create_process : (req, res) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query('insert into person (loginid,  password, name, address, tel, birth, class, point ) value(?,?,?,?,?,?,?,?)',
            [post.loginid, post.password, post.name, post.address, post.tel, post.birth, post.class, post.point], (err, result)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/person/view/v'});
                    res.end();
                }
                
            })
        }
    }, //end of create_process

    update : (req, res)=>{
        var id = req.params.id;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var sql1 = `select * from boardtype;`
            var sql2 = `select * from person where loginid = ${id};`

            db.query(sql1 + sql2, (err, results)=>{

                var context = {
                    menu: "menuForManager.ejs",
                    who: req.session.name,
                    body: 'personCU.ejs',
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    person: results[1][0],
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            })
        }
    }, // end of update 

    update_process : (req, res) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query('update person set loginid = ?,  password= ?, name = ?, address =?, tel = ?, birth = ?, class = ?, point = ? where loginid = ?',
            [post.loginid, post.password, post.name, post.address, post.tel, post.birth, post.class, post.point, post.loginid], (err, results)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/person/view/u'});
                    res.end();
                }
                
            })
        }
    }, //end of update_process

    delete_process : (req, res) =>{
        var id = req.params.id;

        db.query('DELETE FROM person WHERE loginid = ?', [id], (error, result) => { 
            if(error) { throw error; }
            else{
                res.writeHead(302, {Location: '/person/view/u'});
                res.end();
            }
        });
    } // end of delete_process

}