var http 	 = require("http");
var request = require('request');
var url      = require("url");
var fs       = require('fs');
var async    = require("async");
$ 		 = require("cheerio");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db 	 = new mongodb.Db('xs', server, {safe:true});
var  href = "http://www.wanmeishijiexiaoshuo.com/", links ="";

async.waterfall([
	 function(cb){
		 request(href, cb);
	 },
	 function(response,body,cb){
	  	if(response.statusCode == 200){
	   		links = $("a",$(".cat_post",body)[0]);
	   		db.open(cb);
	  	}
	  },
	 function(db,cb){
	     db.collection('wanmei',{safe:true}, cb);
	 },
	 function(collection,cb){
         for (var i = 0,len=links.length; i < len; i++) {
         	var attr = links[i]["attribs"];
         	var filename = (url.parse(attr.href).pathname).slice(1,-1);
         	var href=attr.href;
         	var rel ="./wanmei/";
	            var tmp = {"title":attr.title,
	            		   "href" :href,
	            		   "filename" : filename,
	            		   "rel" : rel,
	            		   "flag" :0
         			}
	            collection.insert(tmp,{safe:true},cb); 
         }
         console.log("finish");
	 }
 ],
 function (err, results) { });



