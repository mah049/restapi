//dependencies
var express = require('express');
var router = express.Router();
var path = require('path');
var Product = require('../models/product');
var fs = require('fs')
var uuid = require('node-uuid');
var request = require('request');


router.get('/', function(req, res) {
	res.sendFile('index.html',{ root: path.join(__dirname, '../views') });
}); 

router.post('/submission', function (req, res) {
	var url = req.body;
	var jobID = uuid.v1();
	console.log(url);
	var holder = url.url;
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

router.get('/test',function ( req, res) {
	var holder = req.body;
	fs.readFile(path.join(__dirname,'../views/index.html'), function (err, html) {
    	if (err) {	
        	throw err; 
        	return;
    	}       
        res.writeHeader(200, {"Content-Type": "text/plain"});  
        res.write(html);  
        res.end();  
    })
});

Product.methods(['get','put','post','delete']);
Product.register(router,'/jobid');

module.exports = router;
