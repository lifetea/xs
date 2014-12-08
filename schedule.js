var schedule = require('node-schedule');

// var rule = new schedule.RecurrenceRule();

// rule.minute = 33;
// console.log("ga");
// var j = schedule.scheduleJob(rule, function(){
// 	console.log("执行任务");
// });

	　　var rule = new schedule.RecurrenceRule();

	　　var times = [10,20,30,40,50];

	　　rule.second = times;

	　　var c=0;
	　　var j = schedule.scheduleJob(rule, function(){
	　　 c++;
	　　console.log(c);
	　　});