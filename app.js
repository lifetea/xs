var cat = require("./cat");
var content = require("./content");
var schedule = require('node-schedule');
var catrule = new schedule.RecurrenceRule();

catrule.minutes = [5,25];
catrule.hour = [0,6,12,21,22,23];

var j = schedule.scheduleJob(catrule, function(){
	cat.update();
});

var contrule = new schedule.RecurrenceRule();
contrule.hour = [0,6,12,21,22,23];
contrule.minutes = [20,55];

var k = schedule.scheduleJob(contrule, function(){
	content.run();
});