var fs = require('fs');
var cheerio = require('cheerio');
fs.readFile('./tp.htm',function(err,data){
    if(err) throw err;
    $ = cheerio.load(data);
    //$('ul').append('<li class="plum">Plum</li>')
    console.log($.html());
    // var jsonObj = JSON.parse(data);
    // var space = ' ';
    // var newLine = '\n';
    // var chunks = [];    
    // var length = 0;

    // for(var i=0,size=jsonObj.length;i<size;i++){
    //     var one = jsonObj[i];
    //     //what value you want 
    //     var value1 = one['value1'];
    //     var value2 = one['value2'];
    //     ....
    //     var value = value1 +space+value2+space+.....+newLine;
    //     var buffer = new Buffer(value);
    //     chunks.push(buffer);
    //     length += buffer.length;
    // }
    
    // var resultBuffer = new Buffer(length);
    // for(var i=0,size=chunks.length,pos=0;i<size;i++){
    //     chunks[i].copy(resultBuffer,pos);
    //     pos += chunks[i].length;
    // }
    
    // fs.writeFile('./resut.text',resultBuffer,function(err){
    //     if(err) throw err;
    //     console.log('has finished');
    // });
    
});