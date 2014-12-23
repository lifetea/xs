var cat = require("./cat");
var content = require("./content");
var schedule = require('node-schedule');
var catrule = new schedule.RecurrenceRule();

catrule.minutes = [15,45];
catrule.hour = [0,6,22,23];

var c=0;
var j = schedule.scheduleJob(catrule, function(){
	cat.update();
});

var contrule = new schedule.RecurrenceRule();
var minutes = [0,5,25,30,35,55];
contrule.minutes = minutes;

var k = schedule.scheduleJob(contrule, function(){
	content.run();
});