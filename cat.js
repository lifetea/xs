var config = require("./config.json");
var request = require('request');
var url      = require("url");
var fs       = require('fs');
var async    = require("async");
$ 		 = require("cheerio");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db 	 = new mongodb.Db('xs', server, {safe:true});
var links ="",collect=null,count=0;
var template = "",eles =[],news=[]; 
var getfn = function(u){
	return (url.parse(u["attribs"].href).pathname).slice(1,-1);
};

var update =function(){
	async.waterfall([
		 function(cb){
//			db.close();
			fs.exists('./wanmei/index.htm', function (exists) {
			  var filepath = !!exists ? './wanmei/index.htm' : './tp/cat.htm';
			  fs.readFile(filepath,cb);
			});
		 },
         function(temp,cb){
			 console.log("444");
			 template = temp.toString();
			 count = $("#container a",template).length;
			 request(config.href, cb);
         },
		 function(response,body,cb){
		  	if(response.statusCode == 200){
		  		console.log("status 200");
		   		links = $("a",$(".cat_post",body)[0]);
		   		db.open(cb);
		  	}else{
		  		cb(true);
		  	}
		  },
		 function(db,cb){
		     db.collection('wanmei',{safe:true}, cb);
		 },
		 function(collection,cb){
			 collect = collection;
			 console.log(links.length,count);
			 if(links.length > count){
		         for (var i = count,len=links.length; i < len; i++) {
		         	var attr = links[i]["attribs"];
		         	var filename = (url.parse(attr.href).pathname).slice(1,-1);
		         	var prename = -1,nextname = 0;
		         	if(i >0){
		         		prename = (url.parse(links[i-1]["attribs"].href).pathname).slice(1,-1);
		         	}
		         	if(i+1 <len){
		         		nextname = (url.parse(links[i+1]["attribs"].href).pathname).slice(1,-1);
		         	}
		         	var href=attr.href;
		         	var rel ="./wanmei/";
			        var tmp = { 
		        			   "title":attr.title,
		            		   "href" :href,
		            		   "filename" : filename,
		            		   "rel" : rel,
		            		   "flag" :0,
		            		   "pre":prename,
		            		   "next":nextname
		         	 };
			        eles.push(tmp);
		         }
		         console.log(eles[0]["filename"]);
		         collect.insert(eles,{safe:true},function(err, result){
		        	 console.log("1");
					 if(count > 0){
						 console.log("2");
						 db.collection("wanmei").findAndModify({"next": 0},[["_id",1]],{$set:{"next":eles[0]["filename"]}},{},cb); 
					 }else{
						 cb(err);
					 }
		         }); 
		         console.log("complete insert");
			 }else{
				 cb(true);
			 }
		 },
	    function(cb){
	        var chunks = [],newstr="";
	        for(var i = 0,len =eles.length; i<len;i++){
	            var content = "<li><a href='"+ eles[i].filename +"'>"+eles[i].title+"</a></li>";
	            chunks.push(content);
	        }
	   		for(var len=links.length,k=links.length-4;k < len;k++){
	   			var fn = (url.parse(links[k]["attribs"].href).pathname).slice(1,-1);
	   			var title = links[k]["attribs"].title;
	   			newstr += "<li><a href='"+ fn +"'>"+title+"</a></li>";
	   		}
	        var html = $.load(template);
	        html("#container").append(chunks.join(""));
	        html("#news").html(newstr);
	        console.log("complete write");
	        fs.writeFile('./wanmei/index.htm', html.html(),{encoding:"utf8"},cb);
	    }
	 ],
	 function (err, results) { 
		db.close();
		console.log("close");
	});
}

exports.update = update;
