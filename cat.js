var http 	 = require("http");
var request = require('request');
var url      = require("url");
var fs       = require('fs');
var async    = require("async");
$ 		 = require("cheerio");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db 	 = new mongodb.Db('xs', server, {safe:true});
var  href = "http://www.wanmeishijiexiaoshuo.com/", links ="",collect=null;
var template = ""; 

var update =function(){
	async.waterfall([
         function(cb){
             fs.readFile('./tp/cat.htm',cb);
         },
		 function(temp,cb){
        	 template = temp.toString();
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
			 collect = collection;
			 collection.count(cb)
		 },
		 function(count,cb){
			 if(links.length > count){
				 var arr = [];
		         for (var i = count,len=links.length; i < len; i++) {
		         	var attr = links[i]["attribs"];
		         	var filename = (url.parse(attr.href).pathname).slice(1,-1);
		         	var href=attr.href;
		         	var rel ="./wanmei/";
			        var tmp = { 
		        			   "title":attr.title,
		            		   "href" :href,
		            		   "filename" : filename,
		            		   "rel" : rel,
		            		   "flag" :0
		         	 };
		             arr.push(tmp);
		         }
		         collect.insert(arr,{safe:true},cb); 
			 }
			console.log("finish");
		 },
	    function(cb){
//		 	collect.find().sort({"_id":1}).toArray(cb);
//			 console.log("count");
//			 collect.count(cb)
	    },
	    function(count,cb){
	    	console.log(docs);
//	        var len = docs.length;
//	        var chunks = [];
//	        for(var i = 0;i<len;i++){
//	            var content = "<a href='"+docs[i].href+"'>"+docs[i].title+"</>";
//	            chunks.push(content);
//	        }
//	        var html = $("#container",template).append(chunks.join(""));
//	        fs.writeFile('./wanmei/index.html', html,cb);
	    }		 
	 ],
	 function (err, results) { });
}






exports.update = update;
