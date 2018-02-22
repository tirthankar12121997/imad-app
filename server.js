var express = require('express');
var morgan = require('morgan');
var path = require('path');

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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','index.html'));
});

app.get('/:articlename', function (req, res) {
    var articlename = req.params.articlename;
    res.send(createtemplate (articles[articlename]) );
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
