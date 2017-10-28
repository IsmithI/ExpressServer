var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var mysql = require('mysql');

var execsql = require('execsql'),
    dbConfig = {
    host: "n7qmaptgs6baip9z.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "bavpvnf9xpf6gqa8",
    password: "rmxopdsj29oki2ao"
},
    sqlFile = __dirname + 'db_init.sql'
;

var app = express();

execsql.config(dbConfig)
    .execFile(sqlFile, function (err, result) {
        console.log(result);
    })
    .end();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var conn = mysql.createConnection({
    host: "n7qmaptgs6baip9z.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "bavpvnf9xpf6gqa8",
    password: "rmxopdsj29oki2ao",
    database: "blogdb"
});

// var posts = [
//     {
//         title: "My first post",
//         content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum hic inventore perspiciatis quibusdam quo suscipit\n" +
//         "        tempora unde ut, voluptates voluptatum. Aliquam aperiam impedit laborum magnam praesentium qui saepe totam\n" +
//         "        voluptate!"
//     }
// ];

app.get("/post/:id", function (req, res) {
    var id = req.params.id;

    conn.query("SELECT * FROM posts WHERE id = " + id + ";", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render("posts.ejs", {post: result[0]});
    });

});

app.get("/", function (req, res) {

    conn.query("SELECT * FROM posts", function (err, result, fields) {
        if (err) throw err;

        result.sort(function (a, b) {
           return a.id < b.id;
        });

        res.render("index.ejs", {posts: result});
    });

});

app.get("/write", function (req, res) {
    res.render("write.ejs");
});

app.post("/write", function (req, res) {
    var title = req.body.title;
    var content = req.body.content;


    conn.query("INSERT INTO posts (title, content, publish_date) VALUES ('" + title + "', '" + content +  "', NOW());", function (err, result) {
        if (err) throw err;

        res.redirect("/");
    });

});

app.listen(3000, function () {
    console.log('Server is running');
});