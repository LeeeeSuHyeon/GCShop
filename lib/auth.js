// 201935312 이수현 lib/auth.js
var db = require('./db');
var sanitizeHtml = require('sanitize-html');
var session = require('express-session')

module.exports = {
    login : (req, res)=>{
        var context = {
            menu : "menuForCustomer.ejs",
            who : '손님',
            body : 'login.ejs',
            logined : 'NO'
        };
        req.app.render('home', context, (err, html)=>{
            res.end(html);
        })
    }, // end of login

    login_process : (req, res)=>{
        var post = req.body;

        sanitizedId = sanitizeHtml(post.id)
        sanitizedPwd = sanitizeHtml(post.pwd)

        db.query('select count(*) as num from person where loginid = ? and password = ?', [sanitizedId, sanitizedPwd], (err, results)=>{

            if (results[0].num === 1){
                db.query('select name, class from person where loginid = ? and password = ?', [sanitizedId, sanitizedPwd], (err, result)=>{
                    req.session.is_logined = true;
                    req.session.name = result[0].name
                    req.session.class = result[0].class
                    res.redirect('/');
                })
            }
            else{
                req.session.is_logined = false;
                req.session.name = '손님';
                req.session.class = '99';
                // res.redirect('/');
                res.end(`<script type='text/javascript'>alert("ID or password is incorrect."); location.href = '/auth/login'; </script>`)
            }
            // if(err || !person || person.length === 0){
    
            //     res.end(`<script type='text/javascript'>alert("ID or password is incorrect."); location.href = '/'; </script>`)
                
            // }
            // else{
            //     var context = {
            //         menu : "menuForCustomer.ejs",
            //         who : person[0].name,
            //         body : 'success_login.ejs',
            //         logined : 'YES'
            //     };
            //     res.render('home', context, (err, html)=>{
            //         res.end(html)
            //     })
            // }



        })
    }, // end of login_process

    logout_process : (req, res)=>{
        req.session.destroy((err)=>{
            res.redirect('/');
        })
    }, // end of logout_process


    register : (req, res) =>{
        var context = {
            menu : "menuForCustomer.ejs",
            who : '손님',
            body : 'register.ejs',
            logined : 'NO'
        };
        req.app.render('home', context, (err, html)=>{
            res.end(html);
        })
    }, // end of register 

    
    register_process : (req, res) =>{
        var post = req.body

        db.query('insert into person (loginid,  password, name, address, tel, birth, class, point ) value(?,?,?,?,?,?,?,?)',
        [post.loginid, post.password, post.name, post.address, post.tel, post.birth, post.class, post.point], (err, result)=>{
            if(err){console.log(err)}
            else{

                // 회원가입 완료되면 알림 띄우기
                res.end(`<script type='text/javascript'>alert("Registration is complete! Please log in")
                <!--
                  setTimeout("location.href='http://localhost:3000/auth/login'", 1000);
                //-->
                  </script>`)
            }
        })

    }// end of register_process 
}