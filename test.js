var http 	 = require("http");
var url      = require("url");
var fs = require('fs');
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
		                console.log(result);
		            }); 
	            };
	        });
		};
	});
}

http.get("http://www.wanmeishijiexiaoshuo.com/", function(res) {  
	//res.setEncoding('binary');
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
		//wanmei rule
		var links = $("a",$(".cat_post",html)[0]);

		//console.log(links);
        // fs.writeFile('./catalog.html',html,function(err){
        //     if(err) throw err;
        //     console.log('has finished');
        // });
		inert(links);
	});
});




// //连接db
// db.open(function(err, db){
//     if(!err){
//         console.log('connect db');
//         // 连接Collection（可以认为是mysql的table）
//         // 第1种连接方式
//         // db.collection('mycoll',{safe:true}, function(err, collection){
//         //     if(err){
//         //         console.log(err);
//         //     }
//         // });
//         // 第2种连接方式
//         db.createCollection('wanmei', {safe:true}, function(err, collection){
//             if(err){
//                 console.log(err);
//             }else{

//                 //新增数据
//                 // var tmp1 = {id:'1',title:'hello',number:1};
//        //          collection.insert(tmp1,{safe:true},function(err, result){
//        //              console.log(result);
//        //          }); 
//                    //更新数据
//                    // collection.update({title:'hello'}, {$set:{number:3}}, {safe:true}, function(err, result){
//                    //     console.log(result);
//                    // });
//                    // 删除数据
//                        // collection.remove({title:'hello'},{safe:true},function(err,result){
//         //                   console.log(result);
//         //               });

//                 // console.log(collection);
//                 // 查询数据
//                 // var tmp1 = {title:'hello'};
//                 //    var tmp2 = {title:'world'};
//                 //    wanmei.insert([tmp1,tmp2],{safe:true},function(err,result){
//                 //    console.log(result);
//                 //    }); 
//                    // collection.find().toArray(function(err,docs){
//                    // console.log('find');
//                    // console.log(docs);
//                    // }); 
//                    collection.findOne(function(err,doc){
//                     console.log('findOne');
//                       console.log(doc);
//                    }); 
//             }

//         });
//         // console.log('delete ...');
//         // //删除Collection
//         // db.dropCollection('mycoll',{safe:true},function(err,result){

//   //           if(err){
                
//         //         console.log('err:');
//         //         console.log(err);
//         //     }else{
//         //         console.log('ok:');
//         //         console.log(result);
//         //     }
//   //       }); 
//     }else{
//         console.log(err);
//     }
// });