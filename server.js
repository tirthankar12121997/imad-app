var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config = {
  user: 'tirthankarnayak',
  database: 'tirthankarnayak',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one' : {
     title : 'article-one',
     heading : 'Article-one',
     date : '12-12-2018',
     content : `content for 
     article-one`
    },
    'article-two' : {
     title : 'article-two',
     heading : 'Article-two',
     date : '13-12-2018',
     content : 'content for article-two'
    },
    'article-three' : {
     title : 'article-three',
     heading : 'Article-three',
     date : '14-12-2018',
     content : 'content for article-three'
    }
};

function createtemplate (data) {
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var htmltemplate = `
    <html>
        <head>
            <title>${title}</title>
            <link href='/ui/style.css' rel = 'stylesheet'>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div class='container'>
                <h2>${heading}</h2>
                <p>${date}</p>
                <p>${content}</p>
            </div>
        </body>
    </html>`;
    return htmltemplate;
}

var pool = new Pool(config);

app.get('/test-db', function(req, res){
    pool.query('select * from test', function(err,result){
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
            var obj = result.rows;
            res.send(JSON.stringify(obj));
        }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','index.html'));
});

var counter = 0;

app.get('/counter', function (req,res) {
  counter++;    
  res.send(counter.toString());    
});

var namelist = [];

app.get('/getname',function (req,res) {
  var name = req.query.name;
  namelist.push(name);
  res.send(JSON.stringify(namelist));
});

app.get('/articles', function (req, res) {
    var articleid = req.query.id;
    pool.query('select * from articles where id = ?',[articleid],function (err,result){
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
            var obj = result.rows;
            res.send(createtemplate(obj));
        }
    });
    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js',function(req,res){
  res.sendFile(path.join(__dirname,'ui','main.js'));	
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
