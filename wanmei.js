var nov = require("./nov");
var schedule = require('node-schedule');


var capt = new schedule.RecurrenceRule();
capt.minutes = [0,30];
var j = schedule.scheduleJob(capt, function(){
	nov.capt();
});

var cont = new schedule.RecurrenceRule();
cont.minutes = [15,45];
var k = schedule.scheduleJob(cont, function(){
	nov.cont();
});