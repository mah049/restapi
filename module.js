//dependencies
var express = require ('express');
var mongoose = require ('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var url = require('./routes/api')
var fs = require('fs')

//connecting the database to rest_test
mongoose.connect('mongodb://localhost/rest_test');

//utilizing the express framework
var app = express();

//body parser and the routes
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', url);

//when user goes to localhost:3000
app.get('/', function(req,res){
	res.sendFile('redirect.html', {root: path.join(__dirname, './views')});
});

//the port that is being listened on
app.listen(3000);
console.log('API is running on port 3000');
