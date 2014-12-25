var conf = require("./conf/wanmei.json");
var request = require('request');
var fs = require('fs');
$      = require("cheerio");
var async = require("async");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db      = new mongodb.Db(conf.db, server, {safe:true});
var template = "",filepath = "",collect=null,ob={}; 

var run =function(){
	async.waterfall([
	    function(cb){
	    	db.close();
	        fs.readFile(conf.cont,cb);
	    },
	    function(temp,cb){
	        template = temp.toString();
	        db.open(cb);
	    },
	    function(db,cb){
	    	console.log("start",new Date().toUTCString());
	        db.collection(conf.collect,{safe:true}, cb);
	    },
	    function(collection,cb){
	    	collect = collection;
	        collection.find({"flag":0}).sort({"_id":1}).toArray(cb);
	    },
	    function(docs,cb){
	    	console.log("request");
	    	ob = docs[0];
	    	if(!!ob&&!ob.rel){
	    		filepath = ""+ob.rel+ob.filename;
	    		request({url:ob.href,timeout:40000}, cb);
	    	}else{
	    		cb(true);
	    	}
	    },
	    function(response,body,cb){
	    	if(response.statusCode == 200){
	     		var content = $.load(body).html("#content .entry p");
	     		var html = $.load(template)
	     		html("#content").append("<h1 class='capt-title'>"+ob.title+"</h1>");
	     		html("#content").append(content);
	     		var  htitle = html("head title").text();
	     		html("head title").text(ob.title+htitle);
	     		html("#page").append("<a class='btn-text' href='"+ob.pre+"'>上一章</a>");
	     		html("#page").append("<a class='btn-text' href='index.htm'>目录</a>");
	     		html("#page").append("<a class='btn-text' href='"+ob.next+"'>下一章</a>");
	     		html("#current").attr("href",ob.filename);
	     		html("#current").attr("title",ob.title);
	     		fs.writeFile(filepath, html.html(),cb);
	    	}else{
	    		cb(true);
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