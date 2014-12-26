var cat = require("./cat");
var content = require("./content");
var schedule = require('node-schedule');
var catrule = new schedule.RecurrenceRule();

catrule.hours = [0,6,12,21,22,23];
catrule.minutes = 20;

var j = schedule.scheduleJob(catrule, function(){
	cat.update();
});

var contrule = new schedule.RecurrenceRule();
contrule.hours = [0,6,12,21,22,23];
contrule.minutes = [20,55];

var k = schedule.scheduleJob(contrule, function(){
	content.run();
});