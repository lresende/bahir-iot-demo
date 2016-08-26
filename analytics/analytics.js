var mqtt = require('mqtt')
var credentials = require('../credentials');

// device information for subscription
var deviceType = credentials.typeId;
var deviceId = credentials.deviceId;

// credentials for application connection
var clientId = "a:"+credentials.org+":analytics-app-"+Math.floor(Math.random() * 100000);

var host = credentials.org + ".messaging.internetofthings.ibmcloud.com";
var port = 1883;
var endpoint = "mqtt://"+host+":"+port;

var client = null;
var bConnected = false;

function connectClient() {
	var opts = {
		clientId: clientId,
		username: credentials.apiKey,
		password: credentials.apiToken
	};

	console.log(endpoint, opts);

	client = mqtt.connect(endpoint, opts);
	client.on('message', function (topic, message) {
		console.log(topic, message.toString());
		processMessage(topic, message);
	});
	client.on("connect", function() {
		bConnected = true;
		console.log("analytics application connected");
		subscribeToDeviceEvents();
	});
	client.on("error", function() {
		bConnected = false;
		console.log(deviceId + " failed to connect");
	});
	client.on("close", function() {
		bConnected = false;
		console.log(deviceId + " disconnected");
	});
}

function subscribeToDeviceEvents() {
	subscribeToTemperatureEvents();
	subscribeToAccelerometerEvents();
}

function subscribeToTemperatureEvents() {
	var eventType = "temp";
	client.subscribe("iot-2/type/"+deviceType+"/id/"+deviceId+"/evt/"+eventType+"/fmt/json");
}

function subscribeToAccelerometerEvents() {
	var eventType = "accel";
	client.subscribe("iot-2/type/"+deviceType+"/id/"+deviceId+"/evt/"+eventType+"/fmt/json");
}

function publishAlertEvent(text) {
	// if the temperature threshold is exceeded, publish an alert event on behalf of the device
	var topic = "iot-2/type/"+deviceType+"/id/"+deviceId+"/evt/alert/fmt/json";
	var payload = {
		d: {
			text: text
		}
	};
	if (bConnected) {
		console.log(topic, payload);
		client.publish(topic, JSON.stringify(payload));
	}
}

function processMessage(topic, message) {
	var typeId = topic.split("/")[2];
	var deviceId = topic.split("/")[4];
	var eventType = topic.split("/")[6];

	try {
		var data = JSON.parse(message.toString());
		if (eventType === "temp") {
			processTempEvent(data.d);
		} else if (eventType === "accel") {
			processAccelEvent(data.d);
		}
	} catch (e) { console.log("Error processing message", e.stack); }
}

// Keep a sliding window of events for analysis
var tempEvents = [];
var accelEvents = [];
var windowSize = 20;

var accelThreshold = 1;
var tempThreshold = 20;

function processTempEvent(data) {
	// add event to array, remove old events if we have more than our window size
	tempEvents.push({ time: (new Date()).getTime(), data: data.temp });
	if (tempEvents.length > windowSize) {
		tempEvents.splice(0, 1);
	}
	checkTempThreshold();
}

function processAccelEvent(data) {
	// add event to array, remove old events if we have more than our window size
	accelEvents.push({ time: (new Date()).getTime(), data: data });
	if (accelEvents.length > windowSize) {
		accelEvents.splice(0, 1);
	}
	checkAccelThreshold();
}

function checkTempThreshold() {
	// add your code here
}

function checkAccelThreshold() {
	// add your code here
}

connectClient();
