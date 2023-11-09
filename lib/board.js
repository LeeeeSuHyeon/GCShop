// 201935312 이수현 - board.js

var db = require('./db');

function authIsOwner(req, res){
    if(req.session.is_logined){return true}
    else{return false}
}


module.exports = {
    typeview : (req, res) =>{
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        db.query(sql1, (err, results)=>{
            if(isOwner){
                var context ={
                    menu : "menuForManager.ejs",
                    who : req.session.name,
                    body : 'board.ejs',
                    logined : req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results,
                    
                }
            }
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            })
        })
    },

    typecreate : (req, res) =>{
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        db.query(sql1, (err, results)=>{
            if(isOwner){
                var context ={
                    menu : "menuForManager.ejs",
                    who : req.session.name,
                    body : 'boardtypeCU.ejs',
                    logined : req.session.is_logined ? 'YES' : 'NO',
                    cu : 'C',
                    boardtypes : results,
                    
                }
            }
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            })

        })
    },

    typecreate_process : (req, res) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query('insert into boardtype (title,  description, numPerPage, write_YN, re_YN) value(?,?,?,?,?)',
            [post.title, post.description, post.numPerPage, post.write_YN, post.re_YN], (err, result)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/board/type/view'});
                    res.end();
                }
                
            })
        }

    },

    typeupdate : (req, res) =>{
        var type_id = req.params.typeId;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var sql1 = `select * from boardtype;`
            var sql2 = `select * from boardtype where type_id = ${type_id}`
            db.query(sql1 + sql2, (err, results)=>{

                var context = {
                    menu: "menuForManager.ejs",
                    who: req.session.name,
                    body: 'boardtypeCU.ejs',
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    cu : 'U',
                    boardtypes : results[0],
                    boardtype : results[1]
                }
                
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            })
        }
    },

    typeupdate_process : (req, res) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query('update boardtype set title = ?,  description= ?, numPerPage = ?, write_YN =?, re_YN = ? where type_id = ?',
            [post.title, post.description, post.numPerPage, post.write_YN, post.re_YN, post.type_id], (err, results)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/board/type/view'});
                    res.end();
                }
                
            })
        }
    },

    typedelete_process : (req, res) =>{
        var type_id = req.params.typeId;

        db.query('DELETE FROM boardtype WHERE type_id = ? ', [type_id], (error, result) => { 
            if(error) { throw error; }
            else{
                res.writeHead(302, {Location: '/board/type/view'});
                res.end();
            }
        });
    },


    

}