var http 	 = require("http");
var fs = require('fs');
$      = require("cheerio");
var async = require("async");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db      = new mongodb.Db('xs', server, {safe:true});
var template = ""; 

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
        
        http.get(ob.href, function(res) {  
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
        		var paragraphs = $("p",$("#content",html));
        		console.log(paragraphs[0]);
        		//inert(links);
        	});
        });
        // var len = docs.length;
        // var chunks = [];
        // for(var i = 0;i<len;i++){
        //     var content = "<a href='"+docs[i].href+"'>"+docs[i].title+"</>";
        //     chunks.push(content);
        // }
        // var html = $("#container",template).append(chunks.join(""));
        // fs.writeFile('./wanmei/index.html', html,cb);
    }
],
function (err, results) {
    // results is now equal to: {one: 1, two: 2}
});
