// 201935312 이수현 lib/db.js

// mysql의 코드가 필요 - DB 접속을 위해 
var mysql = require('mysql');

// DB 연결 설정 
var db = mysql.createConnection({
    host : 'localhost',
    user : 'nodejs',
    password : 'nodejs',
    database : 'webdb2023'
})

// 데이터 베이스 연결 
db.connect();

module.exports = db;    // 모듈 내보내기