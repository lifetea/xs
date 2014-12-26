var nov = require("./nov");
var schedule = require('node-schedule');


var capt = new schedule.RecurrenceRule();
capt.minute = 0;
var j = schedule.scheduleJob(capt, function(){
	nov.cont();
});

var cont = new schedule.RecurrenceRule();
cont.minute = 30;
var k = schedule.scheduleJob(cont, function(){
	nov.cont();
});