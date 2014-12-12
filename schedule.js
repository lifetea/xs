var cat = require("./cat");
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
var hours = [15,16];
var minutes = [11,16,20,54];
//	　　rule.second = times;
rule.hour = hours;
rule.minute =minutes;
　　var c=0;
　　var j = schedule.scheduleJob(rule, function(){
		console.log("1");
	    cat.update();
		console.log("2");
　　});