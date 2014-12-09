var http 	 = require("http");
var url      = require("url");
var fs       = require('fs');
var async    = require("async");
	$ 		 = require("cheerio");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db 	 = new mongodb.Db('xs', server, {safe:true});
var  inert   = function(dataarr){
	db.open(function(err, db){
	    if(!err){
	        console.log('connect db');
	        db.collection('wanmei',{safe:true}, function(err, collection){
	            if(err){
	                console.log(err);
	            }
	            for (var i = 0,len=dataarr.length; i < len; i++) {
	            	var attr = dataarr[i]["attribs"];
	            	var filename = (url.parse(attr.href).pathname).slice(1,-1);
	            	var href="http://wanmei.9dgx.com/"+filename;
		            var tmp = {"title":attr.title,
		            		   "href" :href,
		            		   "filename" : filename,
		            		   "flag" :0
	            			}
		            collection.insert(tmp,{safe:true},function(err, result){
		                //console.log(result);
		            }); 
	            };
	        });
		};
	});
}

http.get("http://www.wanmeishijiexiaoshuo.com/", function(res) {  
	var html = "";
	var size = 0;
	var chunks = [];
	res.on('data', function (chunk) {
		size += chunk.length;
		chunks.push(chunk);
		// html += chunk;
	});
	res.on('end', function(){
		var data = Buffer.concat(chunks, size);
		html = data.toString();
		var links = $("a",$(".cat_post",html)[0]);

		inert(links);
	});
});



