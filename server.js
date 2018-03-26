var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
  user: 'tirthankarnayak',
  database: 'tirthankarnayak',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie:
    {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));

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
                <p>${date.toDateString()}</p>
                <p>${content}</p>
            </div>
        </body>
    </html>`;
    return htmltemplate;
}



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

function hash( input , salt) {
    var hashedString = crypto.pbkdf2Sync(input, salt, 100000, 512, 'sha512');
    return ['pbkdf2Sync','100000',salt,hashedString.toString('hex')].join('$');
}

app.get('/hash/:input', function (req , res){
    var input = req.params.input;
    var salt = crypto.randomBytes(128);
    var hashedString = hash(input,salt);
    res.send(hashedString);
});

app.post('/create-user', function (req , res) {
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbstring = hash( password , salt );
    pool.query('insert into "user" (username , password) values ($1,$2)',[username,dbstring], function (err , result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.status(200).send('registered successfully');
        }
    });
});

var pool = new Pool(config);

app.post('/login', function (req , res) {
    var username = req.body.username;
    var password = req.body.password;
    pool.query('select * from "user" where username = $1',[username], function (err , result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else if(result.rows.length === 0) {
            res.status(403).send('invalid username/password');
        }
        else {
            var dbstring = result.rows[0].password;
            var salt = dbstring.split('$')[2];
            var hashedpass = hash(password,salt);
            if(hashedpass === dbstring) {
                req.session.obj = {userId: result.rows[0].id};
                res.send('credentials correct');
            }
            else {
                res.status(403).send('password wrong');
            }
        }
    });
});

app.get('/check-login', function (req, res) {
    if(req.session && req.session.obj && req.session.obj.userId) {
        res.send('User Id : '+req.session.obj.userId.toString());
    } else {
        res.send('user not logged in');
    }
});

app.get('/logout', function (req, res) {
    delete req.session.obj;
    res.send('logged out');
});



app.get('/articles', function (req, res) {
    var articleid = req.query.id;
    pool.query('select * from articles where id = $1',[articleid],function (err,result){
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
            if(result.rows.length === 0)
            {
                res.status(404).send("article not found");
            }
            else
            {
                var obj = result.rows[0];
                res.send(createtemplate(obj));
            }
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
