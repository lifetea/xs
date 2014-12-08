var http 	 = require("http");
	$ 		 = require("cheerio");
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db 	 = new mongodb.Db('xs', server, {safe:true});
var  inert   = function(dataArr){
	db.open(function(err, db){
	    if(!err){
	        console.log('connect db');
	        db.collection('wanmei',{safe:true}, function(err, collection){
	            if(err){
	                console.log(err);
	            }
	            for (var i = 0,len=dataArr.length; i < len; i++) {
		            var tmp = {"title":dataArr[i]["attribs"].title,
		            		   "href" :dataArr[i]["attribs"].href,
		            		   "time" :new Date()}
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
	res.on('data', function (chunk) {
		html += chunk;
	});
//cat_post
	res.on('end', function(){
	//转换编码
	//html = iconv.decode(html, 'gbk');
		var links = $("a",$(".cat_post",html)[0]);
		//console.log(links);
		console.log("test");
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