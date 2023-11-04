// 201935312 이수현 mechandise.js

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
            db.query("select * from merchandise", (err, results)=>{
                if(isOwner){
                    var context = {
                        menu : "menuForManager.ejs",
                        who : req.session.name,
                        body : 'merchandise.ejs',
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        merchandise : results,
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
                db.query("select * from merchandise", (err, results)=>{
                    var context = {
                        menu : "menuForManager.ejs",
                        who : req.session.name,
                        body : 'merchandise.ejs',
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        merchandise : results,
                        update : 'YES'
                    };
        
                    req.app.render('home', context, (err, html)=>{
                        res.end(html);
                    })
    
                })
            }
        }
    },

    create : (req, res) =>{
        var id = req.params.merId;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var context = {
                menu: "menuForManager.ejs",
                who: req.session.name,
                body: 'merchandiseCU.ejs',
                logined: req.session.is_logined ? 'YES' : 'NO',
                merchandise: null,
            }
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            })
        }
    },

    create_process : (req, res, file) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            if(file === 'No'){ 
                db.query('insert into merchandise (category, name, price, stock,brand, supplier,sale_yn, sale_price) value(?,?,?,?,?,?,?,?)'
                    ,[post.category, post.name, post.price, post.stock, post.brand, post.supplier, post.sale_yn, post.sale_price],(err, result)=>{
                    if(err){console.log(err)}
                    else{
                        res.writeHead(302, {Location: '/merchandise/view/v'});
                        res.end();
                    }
                    }
                )
            }

            else{
                db.query('insert into merchandise (category, name, price, stock, brand, supplier, image, sale_yn, sale_price) value(?,?,?,?,?,?,?,?,?)'
                ,[post.category, post.name, post.price, post.stock, post.brand, post.supplier, file, post.sale_yn, post.sale_price],(err, result)=>{
                if(err){console.log(err)}
                else{
                    res.writeHead(302, {Location: '/merchandise/view/v'});
                    res.end();
                }
                }
            )
            }
                
        }
    },


    update : (req, res)=>{
        var id = req.params.merId;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query('select * from merchandise where mer_id = ?',[id], (err, result)=>{

                var context = {
                    menu: "menuForManager.ejs",
                    who: req.session.name,
                    body: 'merchandiseCU.ejs',
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    merchandise: result[0],
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            })
        }
    },

    update_process : (req, res, file) =>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            if(file === 'No'){
                db.query('update merchandise set category = ?, name = ?, price = ?, stock =?, brand = ?, supplier = ?, sale_yn = ?, sale_price = ? where mer_id = ?',
                [post.category, post.name, post.price, post.stock, post.brand, post.supplier, post.sale_yn, post.sale_price, post.mer_id], (err, results)=>{
                    if(err){console.log(err)}
                    else{
                        res.writeHead(302, {Location: '/merchandise/view/u'});
                        res.end();
                    }
                   
                })
            }
            else {
                db.query('update merchandise set category = ?, name = ?, price = ?, stock =?, brand = ?, supplier = ?, image = ?, sale_yn = ?, sale_price = ? where mer_id = ?',
                [post.category, post.name, post.price, post.stock, post.brand, post.supplier, file, post.sale_yn, post.sale_price, post.mer_id], (err, results)=>{
                    if(err){console.log(err)}
                    else{
                        res.writeHead(302, {Location: '/merchandise/view/u'});
                        res.end();
                    }
                   
                })
            }
        }
    },

    delete_process : (req, res) =>{
        id = req.params.merId ;
        db.query('DELETE FROM merchandise WHERE mer_id = ?', [id], (error, result) => { 
            if(error) { throw error; }
            else{
                res.writeHead(302, {Location: '/merchandise/view/u'});
                res.end();
            }
        });
    }
}