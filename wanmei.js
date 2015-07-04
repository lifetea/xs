var nov = require("./lib/nov");
var schedule = require('node-schedule');


var capt = new schedule.RecurrenceRule();
capt.minute = [0,30];
var j = schedule.scheduleJob(capt, function(){
	nov.capt();
});

var cont = new schedule.RecurrenceRule();
cont.minute = [15,45];
var k = schedule.scheduleJob(cont, function(){
	nov.cont();
});