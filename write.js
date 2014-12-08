var fs = require('fs');
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db      = new mongodb.Db('xs', server, {safe:true});
// fs.readFile('./json.json',function(err,data){
//     if(err) throw err;

//     var jsonObj = JSON.parse(data);
//     var space = ' ';
//     var newLine = '\n';
//     var chunks = [];    
//     var length = 0;

//     for(var i=0,size=jsonObj.length;i<size;i++){
//         var one = jsonObj[i];
//         //what value you want 
//         var value1 = one['value1'];
//         var value2 = one['value2'];
//         ....
//         var value = value1 +space+value2+space+.....+newLine;
//         var buffer = new Buffer(value);
//         chunks.push(buffer);
//         length += buffer.length;
//     }
    
//     var resultBuffer = new Buffer(length);
//     for(var i=0,size=chunks.length,pos=0;i<size;i++){
//         chunks[i].copy(resultBuffer,pos);
//         pos += chunks[i].length;
//     }
    
//     fs.writeFile('./resut.text',resultBuffer,function(err){
//         if(err) throw err;
//         console.log('has finished');
//     });
    
// });

var a = "<!doctype><html><head><meta charset='utf-8'></head><body>";
var b = "</body></html>";

db.open(function(err, db){
    if(!err){
        console.log('connect db');
        db.collection('wanmei',{safe:true}, function(err, collection){
            if(err){
                console.log(err);
            }
           // collection.findOne(function(err,doc){
           //  console.log('findOne');
           //      console.log(doc);
           //      fs.writeFile('./test.html',a+doc.title+b,function(err){
           //          if(err) throw err;
           //          console.log('has finished');
           //      });
           // });
            collection.find().sort({"_id":1}).toArray(function(err,docs){
                var len = docs.length;
                //console.log(len);
                var chunks = [];
                for(var i = 0;i<len;i++){
                    var content = "<a href='"+docs[i].href+"'>"+docs[i].title+"</>";
                    chunks.push(content);
                }
                var html = chunks.join("");
                fs.writeFile('./catalog.html', html,function(err){
                    if(err) throw err;
                    console.log('has finished');
                });
            });            
            // for (var i = 0,len=dataArr.length; i < len; i++) {
            //     var tmp = {"title":dataArr[i]["attribs"].title,
            //                "href" :dataArr[i]["attribs"].href,
            //                "time" :new Date()}
            //     collection.insert(tmp,{safe:true},function(err, result){
            //         console.log(result);
            //     }); 
            // };
        });
    };
});