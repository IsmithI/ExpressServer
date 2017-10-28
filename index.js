var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var mysql = require('mysql');

var execsql = require('execsql');

var sqlFile = __dirname + '/db_init.sql';

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// var conn = mysql.createConnection("mysql://lkbohat1gojsj5xe:t27tstcp4hh2hbbj@p1us8ottbqwio8hv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/b38cd4nhqad3nlw4");
var conn = mysql.createConnection(process.env.JAWSDB_URL);

conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected to DB");
    conn.query("CREATE database if not exists blogdb", function (err, result) {
        if (err) throw err;
        console.log("Database created");

        conn.query(
            " CREATE TABLE IF NOT EXISTS posts (\n" +
            "  id int(11) NOT NULL AUTO_INCREMENT,\n" +
            "  title varchar(100) DEFAULT NULL,\n" +
            "  content text,\n" +
            "  publish_date datetime DEFAULT NULL,\n" +
            "  PRIMARY KEY (id)\n" +
            ") ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8", function (err, result) {
                if (err) throw err;
                console.log(result);
            });
    });
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