var async    = require("async");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db 	 = new mongodb.Db('xs', server, {safe:true});

var collect=null;


async.waterfall([
	 function(cb){
	   		db.open(cb);
	  },
	 function(db,cb){
	     db.collection('wanmei',{safe:true}, cb);
	 },
	 function(collection,cb){
		 //remove
//		 collection.findAndRemove({}, [['_id', -1]],cb); 
		 collect =collection;
		 collection.count(cb);
//		 collection.insert({"next":0},cb);
		 
		// db.wanmei.ensureIndex({"href": 1}, {unique: true});
		 
		 //update
//		 collection.findAndModify({"flag": 1},[["_id",1]],{$set:{"flag":0}},{},cb);
		 
		// collection.findAndModify({"next": "3577.htm"},[["_id",1]],{$set:{"next":0}},{},cb);
		 
		 
	 },
	 function(count,cb){
		  collect.count(cb);
//		 collection.count(cb);
		  console.log("2");
	 }
 ],
 function (err, results) {
	console.log("finish");
});



