var async    = require("async");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db 	 = new mongodb.Db('xs', server, {safe:true});

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
//		 collection.count(cb);
		 
		 
		 
		 //update
		 collection.findAndModify({"flag": 1},[["_id",1]],{$set:{"flag":0}},{},cb);
		 
	 }
 ],
 function (err, results) { });



