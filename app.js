var cat = require("./cat");
var content = require("./content");
var schedule = require('node-schedule');
var catrule = new schedule.RecurrenceRule();




//var minutes = [11,16,20,54];
catrule.minutes = [10,30,50];
//rule.hour = hours;
//rule.minute =minutes;
var c=0;
var j = schedule.scheduleJob(catrule, function(){
	content.run();
});

var conrule = new schedule.RecurrenceRule();
var seconds = [10,40];
catrule.minutes = seconds;

var k = schedule.scheduleJob(conrule, function(){
	console.log("2");
});