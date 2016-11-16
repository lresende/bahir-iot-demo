var device

var client;
var iot_org;
var iot_apiKey;
var iot_apiToken;
var iot_typeId;
var iot_deviceId;
var iot_host;
var iot_port;
var iot_clientid;
var iot_username;
var iot_password;

var isConnected = false;

var model = {
	weight:{
		weight: 100,
	},
	speed:{
		speed: 10,
	},
	power:{
		power:50
	},
	temp: {
		temp: 10,
	},
	sys: {
		cpuLoadAvg: 0.25,
		freeMemory: 485908145
	},
	credentials:{
		orgId : null,
		apiKey : null,
		apiToken : null,
		typeId : null,
		deviceId : null
	}
}

function init() {
	$('#weight').slider({ formatter: function(value) { model.weight.weight = value; return value; } });
	$('#speed').slider({ formatter: function(value) { model.speed.speed = value; return value; } });
	$('#power').slider({ formatter: function(value) { model.power.power = value; return value; } });
	$('#temp').slider({ formatter: function(value) { model.temp.temp = value; return value; } });
	$('#cpu').slider({ formatter: function(value) { model.sys.cpuLoadAvg = value; return value; } });
	$('#memory').slider({ formatter: function(value) { model.sys.freeMemory = value; return value; } });

	$(".iot-config-button").click(function(evt) {
		model.credentials.orgId = $('#orgId').val();
		model.credentials.apiKey = $('#apiKey').val();
		model.credentials.apiToken = $('#apiToken').val();

		onConfirmConfig();
	});
}

var bRandomize = true;

function getTopicName(eventId){
	return "bahir/iot"
		+ "/id/"
		+ model.credentials.deviceId
		+ "/evt/"
		+ eventId;
}

function publishWeight() {
	var res = publishMessage(getTopicName("weight"), model.weight.weight);
	$("#indicator-weight").addClass("pub");
	setTimeout(function() { $("#indicator-weight").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.weight.weight += -0.1 + Math.random() * 0.2;
			$('#weight').slider('setValue', model.weight.weight);
		}
		setTimeout(publishWeight, 500);
	}
}

function publishSpeed() {
	var res = publishMessage(getTopicName("speed"), model.speed.speed);
	$("#indicator-speed").addClass("pub");
	setTimeout(function() { $("#indicator-speed").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.speed.speed += -5 + Math.random() * 10;
			$('#speed').slider('setValue', model.speed.speed);
		}
		setTimeout(publishSpeed, 500);
	}
}

function publishPower() {
	var res = publishMessage(getTopicName("power"), model.power.power);
	$("#indicator-power").addClass("pub");
	setTimeout(function() { $("#indicator-power").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.power.power += Math.abs(-0.1 + Math.random() * 0.2);
			$('#power').slider('setValue', model.power.power);
		}
		setTimeout(publishPower, 500);
	}
}

function publishTemp() {
	var res = publishMessage(getTopicName("temp"), model.temp.temp);
	$("#indicator-temp").addClass("pub");
	setTimeout(function() { $("#indicator-temp").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.temp.temp += -1 + Math.random() * 2;
			$('#temp').slider('setValue', model.temp.temp);
		}
		setTimeout(publishTemp, 2000);
	}
}

function publishSys() {
	var res = publishMessage(getTopicName("sys"), model.sys);
	$("#indicator-sys").addClass("pub");
	setTimeout(function() { $("#indicator-sys").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.sys.cpuLoadAvg += -0.05 + Math.random() * 0.1;
			model.sys.freeMemory += -100000 + Math.random() * 200000;
			$('#cpu').slider('setValue', model.sys.cpuLoadAvg);
			$('#memory').slider('setValue', model.sys.freeMemory);
		}
		setTimeout(publishSys, 10000);
	}
}

function publishMessage(topic, payload) {
	try {
		var message = new Paho.MQTT.Message(String(payload));
		message.destinationName = topic;
		console.log(topic, payload);
		window.client.send(message);
		return true;
	} catch (e) {
		onConnectFailure();
	}
}

function startPublish() {
	console.log("Should publish ? " + isConnected)
	if (isConnected) {
		console.log("Publishing... ")
		publishWeight();
		publishTemp();
		publishSpeed();
		publishPower();
		publishSys();
	}
}


function onConfirmConfig(){
	$.ajax({
		url: "/config",
		type: "PUT",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({
			orgId : model.credentials.orgId,
			apiKey : model.credentials.apiKey,
			apiToken : model.credentials.apiToken
		}),
		success: function(response) {
			console.log(response);

			$.ajax({
				url: "/credentials",
				type: "GET",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function(response) {
					console.log(response);
					window.iot_org = response.org;
					window.iot_apiKey = response.apiKey;
					window.iot_apiToken = response.apiToken;
					window.iot_typeId = response.typeId;
					window.iot_deviceId = response.deviceId;
					window.iot_host = "localhost" // response.org + ".messaging.internetofthings.ibmcloud.com";
					window.iot_port = 9001;
					//window.iot_clientid = "d:"+response.org+":"+response.typeId+":"+response.deviceId;
					window.iot_clientid = "a:"+response.org+":"+"123243432423423";
					//window.iot_username = "use-token-auth";
					window.iot_username = response.apiKey;
					window.iot_password = response.apiToken;
					$("#deviceId").html(response.deviceId);
					// window.client = new Paho.MQTT.Client(window.iot_host, window.iot_port, window.iot_clientid);
					window.client = new Paho.MQTT.Client(window.iot_host, window.iot_port, window.iot_clientid);

					model.credentials.typeId = response.typeId;
					model.credentials.deviceId = response.deviceId;

					connectDevice();
					//registerDevice();
				},
				error: function(xhr, status, error) {
					console.error("Could not fetch organization information.");
				}
			});

		},
		error: function(xhr, status, error) {
			console.error(xhr, status, error);
		}
	});



}

function onConnectSuccess() {
	// The device connected successfully
	console.log("Connected Successfully!");
	isConnected = true;
	$(".connectionStatus").html("Connected");
	$(".connectionStatus").addClass("connected");

	startPublish();
	/*
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log(position);
			startPublish();
		});
	} else {
		startPublish();
	}
	*/
}

function onConnectFailure( error ) {
	// The device failed to connect. Let's try again in one second.
	console.log("Unable to connect to IoT Foundation! Trying again in one second.");
	console.log( error.errorCode );
	console.log( error.errorMessage );

	isConnected = false;
	$(".connectionStatus").html("Connecting");
	$(".connectionStatus").removeClass("connected");
	setTimeout(connectDevice(), 1000);
}

function connectDevice() {
	//$("#deviceId").html(window.deviceId);

	$(".connectionStatus").html("Connecting");
	$(".connectionStatus").removeClass("connected");
	console.log("Connecting device to IoT Foundation...");
	window.client.connect({
		onSuccess: onConnectSuccess,
		onFailure: onConnectFailure
		// userName: window.iot_username,
		// password: window.iot_password
	});
}

$(document).ready(function() {
	init();
});

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
