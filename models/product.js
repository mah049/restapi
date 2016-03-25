// dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

//schema
var urlSchema = new mongoose.Schema({
	name: String,
	url: String,
	jobID : String,
	html: String
});

//return model
var URL = module.exports = restful.model('URL', urlSchema);

//adding a url or job id
module.exports.addURL = function(url, JOBID, temp, callback){
	url.jobID = JOBID;
	url.html = temp;
	URL.create(url, callback);
}

//finding the url, jobid, or name
module.exports.getURLByJobID = function(id, callback){
	URL.find(id, callback);
}
