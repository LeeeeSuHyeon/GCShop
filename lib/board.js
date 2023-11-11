// 201935312 이수현 - board.js

var db = require('./db');
var sanitizedHtml = require('sanitize-html')
var templete = require('../template')

function authIsOwner(req, res){
    if(req.session.is_logined){return true}
    else{return false}
}


module.exports = {

    // boardtype =================================================

    typeview : (req, res) =>{
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        db.query(sql1, (err, results)=>{
            if(isOwner){
                var context ={
                    menu : "menuForManager.ejs",
                    who : req.session.name,
                    body : 'boardtype.ejs',
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

    // view =================================================    

    view : (req, res)=>{
        var sntzedTypeId = sanitizedHtml(req.params.typeId);
        var pNum = req.params.pNum;

        var isOwner = authIsOwner(req, res);

        var sql1 = `select * from boardtype;`
        var sql2 = `select * from boardtype where type_id = ${sntzedTypeId};`
        var sql3 = `select count(*) as total from board where type_id = ${sntzedTypeId};`
        
        db.query(sql1 + sql2 + sql3, (err, results)=>{
            var numPerPage = results[1][0].numPerPage;
            var offs = (pNum-1)*numPerPage; //0 3 6 ..
            var totalPages = Math.ceil(results[2][0].total / numPerPage);
            db.query(`select b.board_id as board_id, b.title as title, b.date as date, p.name as name
                        from board b inner join person p on b.loginid = p.loginid
                        where b.type_id = ? and b.p_id = ? ORDER BY date desc, board_id desc LIMIT ? OFFSET ?`,
                        [sntzedTypeId, 0, numPerPage, offs], (err,boards)=>{

                    var context;
                    
                    if(isOwner){
                        if (req.session.class === '00'){
                            context ={
                                menu : "menuForCeo.ejs",
                                who : req.session.name,
                                logined : req.session.is_logined ? 'YES' : 'NO',
                                boardtypes : results[0],
                                body : 'board.ejs',
                                boardtype : results[1][0],
                                write : results[1][0].write_YN,
                                boards : boards,
                                update : 'NO',
                                totalPages : totalPages,
                                pNum : pNum
                            }
                        }
                        else if (req.session.class === '01') {
                            context ={
                                menu : "menuForManager.ejs",
                                who : req.session.name,
                                logined : req.session.is_logined ? 'YES' : 'NO',
                                boardtypes : results[0],
                                body : 'board.ejs',
                                boardtype : results[1][0],
                                write : "Y",
                                boards : boards,
                                update : 'YES',
                                totalPages : totalPages,
                                pNum : pNum
                            }
                        } 
                        else if (req.session.class === '02') {
                            context ={
                                menu : "menuForCustomer.ejs",
                                who : req.session.name,
                                logined : req.session.is_logined ? 'YES' : 'NO',
                                boardtypes : results[0],
                                body : 'board.ejs',
                                boardtype : results[1][0],
                                write : results[1][0].write_YN,
                                boards : boards,
                                update : 'NO',
                                totalPages : totalPages,
                                pNum : pNum
                            }
                        }
                    }else{
                        context ={
                            menu : "menuForCustomer.ejs",
                            who : req.session.name,
                            logined : req.session.is_logined ? 'YES' : 'NO',
                            boardtypes : results[0],
                            body : 'board.ejs',
                            boardtype : results[1][0],
                            write : 'N',
                            boards : boards,
                            update : 'NO',
                            totalPages : totalPages,
                            pNum : pNum
                        }
                    }


                    req.app.render('home', context, (err, html)=>{
                        res.end(html);
                    })
            })  // end of db.query(board)
        })   // end of db.query(sql1+sql2)
    },  //end of view

    detail : (req, res)=>{
        var boardId = req.params.boardId;
        var pNum = req.params.pNum;
        var isOwner = authIsOwner(req, res);

        var sql1 = `select * from boardtype;`
        var sql2 = `select * from board where board_id = ${boardId};`
        var sql3 = `select b.board_id as board_id, b.title as title, b.date as date, p.name as name, p.loginid as loginid, b.type_id as type_id, b.content as content
                    from board b inner join person p on b.loginid = p.loginid
                    where b.board_id = ${boardId};`
        db.query(sql1 + sql2 + sql3, (err,results)=>{
            // 자신이 쓴 게시물이거나 관리자라면 CU = true
            var CU = req.session.loginid === results[2][0].loginid || req.session.class === '01' ? true : false
            
            var context;
            if(isOwner){
                if (req.session.class === '00'){
                    context ={
                        menu : "menuForCeo.ejs",
                        who : req.session.name,
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        body : 'boardCRU.ejs',
                        CRU : "R", 
                        board : results[2][0],
                        CU : null,
                    }
                }
                else if (req.session.class === '01') {
                    context ={
                        menu : "menuForManager.ejs",
                        who : req.session.name,
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        body : 'boardCRU.ejs',
                        CRU : "R", 
                        board : results[2][0],
                        CU : CU
                    }
                } 
                else if (req.session.class === '02') {
                    context ={
                        menu : "menuForCustomer.ejs",
                        who : req.session.name,
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        body : 'boardCRU.ejs',
                        CRU : "R", 
                        board : results[2][0],
                        CU : CU
                    }
                }
            }
            else{
                context ={
                    menu : "menuForCustomer.ejs",
                    who : req.session.name,
                    logined : req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    body : 'boardCRU.ejs',
                    CRU : "R", 
                    board : results[2][0],
                    CU : CU
                }
            }

            req.app.render('home', context, (err, html)=>{
                res.end(html);
            })
        })
    },

    create : (req, res)=>{
        var typeId = req.params.typeId;
        var isOwner = authIsOwner(req, res);
        var sql1 = `select * from boardtype;`
        var sql2 = `select * from boardtype where type_id = ${typeId};`
        db.query(sql1+sql2, (err, results)=>{
            if(isOwner){
                // 관리자
                var context;
                if (req.session.class === '01') {
                    context ={
                        menu : "menuForManager.ejs",
                        who : req.session.name,
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        body : 'boardCRU.ejs',
                        CRU : "C", 
                        boardtype : results[1][0],
                        name : req.session.name,
                        loginid : req.session.loginid,
                        board: null,
                        CU : null,
                    }
                } 
                // 일반 회원 
                else if (req.session.class === '02') {
                    context ={
                        menu : "menuForCustomer.ejs",
                        who : req.session.name,
                        logined : req.session.is_logined ? 'YES' : 'NO',
                        boardtypes : results[0],
                        body : 'boardCRU.ejs',
                        CRU : "C", 
                        boardtype : results[1][0],
                        name : req.session.name,
                        loginid : req.session.loginid,
                        board: null,
                        CU : null,
                    }
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            }
        })
    },

    create_process : (req, res)=>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query(`insert into board (type_id, p_id, loginid, password, title, date, content) values(?, ?, ?, ?, ?, ? ,?)`,
                [post.type_id, 0, post.loginid, post.password, post.title, templete.dateOfEightDigit(), post.content], (err, result)=>{
                    if(err){console.log(err)}
                    else{
                        res.writeHead(302, {Location: `/board/view/${post.type_id}/1`});
                        res.end();
                    }
            }
            )
        }

    },


    update : (req, res)=>{
        var boardId = req.params.boardId;
        var typeId = req.params.typeId;
        var pNum = req.params.pNum;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var sql1 = `select * from boardtype;`
            var sql2 = `select b.board_id as board_id, b.title as title, b.date as date, p.name as name, p.loginid as loginid, b.type_id as type_id, b.content as content
                        from board b inner join person p on b.loginid = p.loginid
                        where b.board_id = ${boardId};`

            db.query(sql1 + sql2, (err, results)=>{
                var context = {
                    menu : "menuForManager.ejs",
                    who : req.session.name,
                    logined : req.session.is_logined ? 'YES' : 'NO',
                    boardtypes : results[0],
                    body : 'boardCRU.ejs',
                    CRU : "U", 
                    board : results[1][0],
                    CU : null
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                })
            })
        }
    },

    update_process : (req, res)=>{
        var post = req.body;
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            db.query('update board set title = ?, content = ? where board_id = ?', 
                    [post.title, post.content, post.board_id], (err, results)=>{
                        if(err){console.log(err)}
                        else{
                            res.writeHead(302, {Location: `/board/view/${post.type_id}/1`});
                            res.end();
                        }
            })
        }
    },

    delete_process : (req, res)=>{
        var boardId = req.params.boardId;

        db.query('DELETE FROM board WHERE board_id = ?', [boardId], (error, result) => { 
            if(error) { throw error; }
            else{
                res.writeHead(302, {Location: `/board/view/1/1`});
                res.end();
            }
        });
    },



    

}