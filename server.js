var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

console.log('hello');

var articles = { 
	'article-one' : {
	title: 'Article-1',
	heading: 'Article-one',
	date: '1 Dec 2017',
	content: `
			<p>
				This is the content for article-one.This is the content for article-one.This is the content for article-one.This is the content for article-one.This is the content for article-one.
				This is the content for article-one.
				This is the content for article-one.This is the content for article-one.This is the content for article-one.
			</p>
			<p>
				This is the content for article-one.This is the content for article-one.This is the content for article-one.This is the content for article-one.This is the content for article-one.
				This is the content for article-one.
				This is the content for article-one.This is the content for article-one.This is the content for article-one.
			</p>
			<p>
				This is the content for article-one.This is the content for article-one.This is the content for article-one.This is the content for article-one.This is the content for article-one.
				This is the content for article-one.
				This is the content for article-one.This is the content for article-one.This is the content for article-one.
			</p>`
    },
    'article-two' : {
	title: 'Article-2',
	heading: 'Article-two',
	date: '12 Dec 2017',
	content: `
			<p>
				This is the content for article-two.
			</p>`
    },
    'article-three' : {
	title: 'Article-3',
	heading: 'Article-three',
	date: '13 Dec 2017',
	content: `
			<p>
				This is the content for article-three.
			</p>`
    }
};

function createtemplate(data){
	title = data.title;
	heading = data.heading;
	date = data.date;
	content = data.content;
	var htmltemplate = `
	<html>
	<head>
		<title>
			${title}
		</title>
		<meta charset="viewport" content="width=device-width,initial-scale=1" />
		<link href="ui/style.css" rel="stylesheet"/>
	</head>
	<body>
		<div class = "container">
		<div>
		<a href = "/">Home</a>
		</div>
		<hr/>
		<h3>${heading}</h3>
		<div>
			${date}
		</div>
		<div>
			${content}
		</div>
		</div>
	</body>
	</html>`;
	return htmltemplate;
}

var counter = 0;

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','index.html'));
});

app.get('/counter',function(req,res){
  counter++;
  res.send(counter.toString());
});

app.get('/:articleName',function(req,res){
  var articleName = req.params.articleName;
  res.send(createtemplate(articles[articleName]));
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
