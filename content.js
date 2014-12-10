var request = require('request');
var fs = require('fs');
var cheerio      = require("cheerio");
var async = require("async");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db      = new mongodb.Db('xs', server, {safe:true});
var template = "",filepath = ""; 

async.waterfall([
    function(cb){
        fs.readFile('./tp/cat.htm',cb);
    },
    function(temp,cb){
        template = temp.toString();
        db.open(cb);
    },
    function(db,cb){
        db.collection('wanmei',{safe:true}, cb);
    },
    function(collection,cb){
        collection.find().sort({"_id":1}).toArray(cb);
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
    }
],
function (err, results) {
	console.log("finish");
    // results is now equal to: {one: 1, two: 2}
});
