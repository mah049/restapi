//dependencies
var express = require('express');
var path = require('path');
var Product = require('../models/product');
var fs = require('fs')
var uuid = require('node-uuid');
var request = require('request');

//express framework router
var router = express.Router();

//if the user goes to localhost:3000/api
router.get('/', function(req, res) {
	//sends the page that displays all the api functions
	res.sendFile('index.html',{ root: path.join(__dirname, '../views') });
}); 

//redirect for form submission
router.post('/submission', function (req, res) {
	var url = req.body;
	//generate a random uuid for the job
	var jobID = uuid.v1();
	var holder = url.url;
	//gets the html of the url
	request(holder, function(error, response, html){
		if (!error && response.statusCode == 200) { 
			Product.addURL(url,jobID, html, function(err, url){
				if(err){
					throw err;
				}
			var string = 'URL Successfully Submitted: <br>'+ req.body.url+"<br><br>" + 'JobID is: <br>' + jobID +
			'<br><br>'
			var html= "<form action='http://127.0.0.1:3000/api/''>"+
    		"<input type='submit' value='Back'></form>"
    		string = string+html;
			res.send(string);
			res.end();
			});
  		}
	});

});

//search the database by job
router.post('/joblookup', function(req, res){
	var id = req.body;
	Product.getURLByJobID(id, function(err, url){
		console.log(url);
		if(err||Object.keys(url).length == 0 || JSON.stringify(url) == JSON.stringify({})){
			res.status(404).send('ERROR: ID Not Found')
			return;
		}
		var holder = url[0].url
		request(holder, function(error, response, html){
  			if (!error && response.statusCode == 200) {
        		res.writeHeader(200, {"Content-Type": "text/plain"});      			
    			res.write(html);
    			res.end();
  			}
		});
	});
});

//search the database by name
router.post('/namelookup', function(req, res){
	var id = req.body;
	var i;
	console.log(id);
	Product.getURLByJobID(id, function(err, url){
		if(err||Object.keys(url).length == 0 || JSON.stringify(url) == JSON.stringify({})){
			res.status(404).send('ERROR: Name Not Found')
			return;
		}
		var string = ''
		var num = Object.keys(url).length;
		for( i =0; i<num; i++){
			string += url[i].jobID+'<br>';
		}
		string += "<form action='http://127.0.0.1:3000/api/''>"+
    		"<input type='submit' value='Back'></form>"
		res.send('These are the jobID\'s associated with '+ id.name + ':<br>'+ string); 
	});
});

//search the database by url
router.post('/urllookup', function(req, res){
	var id = req.body;
	Product.getURLByJobID(id, function(err, url){
		if(err||Object.keys(url).length == 0 || JSON.stringify(url) == JSON.stringify({})){
			res.status(404).send('ERROR: URL Not Found')
			return;
		}
		var string = ''
		var num = Object.keys(url).length;
		for( i =0; i<num; i++){
			string += url[i].jobID+'<br>';
		}
		string += "<form action='http://127.0.0.1:3000/api/''>"+
    		"<input type='submit' value='Back'></form>"
		res.send("These are the jobID\'s associated with "+ id.url +':<br>'+string);
	});
});

//HTTP Verbs utilized in the REST api
Product.methods(['get','put','post','delete']);
//restfulapi
Product.register(router,'/jobid');

module.exports = router;
