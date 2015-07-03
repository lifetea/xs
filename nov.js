var conf = require("./conf/wanmei.json");
var request = require('request');
var url      = require("url");
var fs       = require('fs');
var async    = require("async");
$ 		 = require("cheerio");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db 	 = new mongodb.Db(conf.db, server, {safe:true});
var links ="",collect=null,count=0;
var template = "",eles =[],news=[]; 
var filepath = "",ob={}; 

var getfn = function(u){
	return (url.parse(u["attribs"].href).pathname).slice(1,-1);
};

var capt =function(){
	async.waterfall([
		 function(cb){
			db.close();
			fs.exists(conf.index, function (exists) {
			  var filepath = !!exists ? conf.index : conf.tp;
			  fs.readFile(filepath,cb);
			});
		 },
         function(temp,cb){
			 console.log("request",new Date());
			 template = temp.toString();
			 count = $("#container a",template).length;
			 request({url:conf.href,timeout:40000}, function (error, response, body){
				  if (!error && response.statusCode == 200) {
				    cb(null,body)
				  }else{
					  cb(true);
				  }
				});
         },
		 function(body,cb){
		  		console.log("status 200");
		   		db.open(cb);
		   		links = $("a",$(".cat_post",body)[0]);
		  },
		 function(db,cb){
		     db.collection(conf.collect,{safe:true}, cb);
		 },
		 function(collection,cb){
			 collect = collection;
			 console.log("links:",links.length,"count:",count);
			 if(links.length > count){
		         for (var i = count ,len=links.length; i < len; i++) {
		         	var attr = links[i]["attribs"];
		         	var filename = (url.parse(attr.href).pathname).slice(1,-1);
		         	var prename = -1,nextname = 0;
		         	if(i >0){
		         		prename = getfn(links[i-1]);
		         	}
		         	if(i+1 <len){
		         		nextname =getfn(links[i+1]); 
		         	}
		         	var href=attr.href;
			        var tmp = {"title":attr.title,"href" :href,"filename" : filename,"rel" : conf.rel,"flag" :0,"pre":prename,"next":nextname};
			        eles.push(tmp);
		         }
		         collect.insert(eles,{safe:true},function(err, result){
		        	 if(err) throw err;
		        	 console.log("complete insert");
		        	 if(count > 0){
						 db.collection(conf.collect).findAndModify({"next": 0},[["_id",1]],{$set:{"next":eles[0]["filename"]}},{},cb); 
					 }else{
						 cb(null);
					 }
		         }); 
			 }else{
				 cb(true);
			 }
		 },
	    function(cb){
	        var chunks = [],newstr="";
	        for(var i = 0,len =eles.length; i<len;i++){
	            var content = "<li class='col-md-6'><a href='"+ eles[i].filename +"'>"+eles[i].title+"</a></li>";
	            chunks.push(content);
	        }
	   		for(var len=links.length,k=links.length-4;k < len;k++){
	   			var fn = (url.parse(links[k]["attribs"].href).pathname).slice(1,-1);
	   			var title = links[k]["attribs"].title;
	   			newstr += "<li class='col-md-6'><a href='"+ fn +"'>"+title+"</a></li>";
	   		}
	        var html = $.load(template);
	        html("#container").append(chunks.join(""));
	        html("#news").html(newstr);
	        console.log("complete write");
	        db.close();
	        fs.writeFile(conf.index, html.html(),{encoding:"utf8"},cb);
	    }
	 ],
	 function (err, results) { 
		db.close();
		console.log("close");
	});
}

var cont =function(){
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
	    	console.log("start",new Date());
	        db.collection(conf.collect,{safe:true}, cb);
	    },
	    function(collection,cb){
	    	collect = collection;
	        collection.find({"flag":0}).sort({"_id":1}).toArray(cb);
	    },
	    function(docs,cb){
	    	
	    	ob = docs[0];
	    	if(!!ob && !!ob.rel){
	    		filepath = ""+ob.rel+ob.filename;
	    		console.log("request");
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
exports.capt = capt;
exports.cont = cont;