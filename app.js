var cat = require("./cat");
var content = require("./content");
var schedule = require('node-schedule');


catrule.minute = 0;
var catrule = new schedule.RecurrenceRule();
var j = schedule.scheduleJob(catrule, function(){
	cat.update();
});

var contrule = new schedule.RecurrenceRule();
contrule.minute = 30;
var k = schedule.scheduleJob(contrule, function(){
	content.run();
});