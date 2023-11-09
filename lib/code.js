// 201935312 이수현 - code.js

var db = require('./db');

function authIsOwner(req, res){
    if(req.session.is_logined){return true}
    else{return false}
}


module.exports = {
    view : (req,res)=>{
        var vu = req.params.vu; 

        if (vu === "v"){
            var isOwner = authIsOwner(req, res);
            db.query("select * from code_tbl", (err, results)=>{
                if(isOwner){
                    var context = {
                        menu : "menuForManager.ejs",
                        who : req.session.name,
                        body : 'code.ejs',
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        codes : results,
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
            if(isOwner){
                db.query("select * from code_tbl", (err, results)=>{
                    var context = {
                        menu : "menuForManager.ejs",
                        who : req.session.name,
                        body : 'code.ejs',
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        codes : results,
                        update : 'YES'
                    };
        
                    req.app.render('home', context, (err, html)=>{
                        res.end(html);
                    })
    
                })
            }
        }
    }, // end of view

    create : (req, res) =>{
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var context = {
                menu: "menuForManager.ejs",
                who: req.session.name,
                body: 'codeCU.ejs',
                logined: req.session.is_logined ? 'YES' : 'NO',
                code: null,     // create와 update를 분류하기 위해 null을 넣음
            }
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            })
        }
    }, // end of create

    create_process : (req, res) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query('insert into code_tbl (main_id,  main_name, sub_id, sub_name, start, end) value(?,?,?,?,?,?)',
            [post.main_id, post.main_name, post.sub_id, post.sub_name, post.start, post.end], (err, result)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/code/view/v'});
                    res.end();
                }
                
            })
        }
    }, //end of create_process


    update : (req, res)=>{
        var mainId = req.params.main;
        var subId = req.params.sub;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query('select * from code_tbl where main_id = ? and sub_id = ?',[mainId, subId], (err, result)=>{

                var context = {
                    menu: "menuForManager.ejs",
                    who: req.session.name,
                    body: 'codeCU.ejs',
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    code: result[0],
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
            db.query('update code_tbl set main_id = ?,  main_name= ?, sub_id = ?, sub_name =?, start = ?, end = ?  where main_id = ? and sub_id = ?',
            [post.main_id, post.main_name, post.sub_id, post.sub_name, post.start, post.end, post.main_id, post.sub_id], (err, results)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/code/view/u'});
                    res.end();
                }
                
            })
        }
    }, //end of update_process

    delete_process : (req, res) =>{
        var mainId = req.params.main;
        var subId = req.params.sub;

        db.query('DELETE FROM code_tbl WHERE main_id = ? and sub_id = ?', [mainId, subId], (error, result) => { 
            if(error) { throw error; }
            else{
                res.writeHead(302, {Location: '/code/view/u'});
                res.end();
            }
        });
    } // end of delete_process
}