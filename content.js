var request = require('request');
var fs = require('fs');
var cheerio      = require("cheerio");
var async = require("async");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db      = new mongodb.Db('xs', server, {safe:true});
var template = "",filepath = "",collect=null; 

var run =function(){
	async.waterfall([
	    function(cb){
	        fs.readFile('./tp/content.htm',cb);
	    },
	    function(temp,cb){
	        template = temp.toString();
	        db.open(cb);
	    },
	    function(db,cb){
	        db.collection('wanmei',{safe:true}, cb);
	    },
	    function(collection,cb){
	    	collect = collection;
	        collection.find({"flag":0}).sort({"_id":1}).toArray(cb);
	    },
	    function(docs,cb){
	        var ob = docs[0];
	        filepath = ""+ob.rel+ob.filename;
	        request(ob.href, cb);
	    },
	    function(response,body,cb){
	    	if(response.statusCode == 200){
	    		 $ = cheerio.load(body);
	     		html = $.html("#content .entry p");
	     		fs.writeFile(filepath, html,cb);
	    	}
	    },
	    function(cb){
	    	collect.findAndModify({"flag": 0},[["_id",1]],{$set:{"flag":1}},{},cb);
	    	console.log("update");
	    }
	],
	function (err, results) {
		db.close();
		console.log("finish");
	});
}

exports.run = run;