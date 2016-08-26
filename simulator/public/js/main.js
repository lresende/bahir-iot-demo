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
	accel: {
		x: 0,
		y: 0,
		z: 0
	},
	gyro: {
		x: 0,
		y: 0,
		z: 0
	},
	mag: {
		x: 0,
		y: 0,
		z: 0
	},
	temp: {
		temp: 10,
	},
	input: {
		UP: false,
		DOWN: false,
		LEFT: false,
		RIGHT: false,
		SELECT: false,
		A: false,
		B: false
	},
	sys: {
		cpuLoadAvg: 0.25,
		freeMemory: 485908145,
		wlan0: "192.168.1.243",
		location: {
			latitude: null,
			longitude: null
		}
	}
}

function init() {
	$('#accel-x').slider({ formatter: function(value) { model.accel.x = value; return value; } });
	$('#accel-y').slider({ formatter: function(value) { model.accel.y = value; return value; } });
	$('#accel-z').slider({ formatter: function(value) { model.accel.z = value; return value; } });
	$('#gyro-x').slider({ formatter: function(value) { model.gyro.x = value; return value; } });
	$('#gyro-y').slider({ formatter: function(value) { model.gyro.y = value; return value; } });
	$('#gyro-z').slider({ formatter: function(value) { model.gyro.z = value; return value; } });
	$('#mag-x').slider({ formatter: function(value) { model.mag.x = value; return value; } });
	$('#mag-y').slider({ formatter: function(value) { model.mag.y = value; return value; } });
	$('#mag-z').slider({ formatter: function(value) { model.mag.z = value; return value; } });
	$('#temp').slider({ formatter: function(value) { model.temp.temp = value; return value; } });
	$('#cpu').slider({ formatter: function(value) { model.sys.cpuLoadAvg = value; return value; } });
	$('#memory').slider({ formatter: function(value) { model.sys.freeMemory = value; return value; } });

	$(".iot-button").mousedown(function(evt) {
		var inputType = evt.target.id.split("-")[1];
		model.input[inputType] = true;
		$(evt.target).addClass("iot-button-down");
		publishInput();
		$(".iot-controller-input").mouseup(function(evt) {
			model.input[inputType] = false;
			$("#button-"+inputType).removeClass("iot-button-down");
			publishInput();
			$(".iot-controller-input").off("mouseup");
			$(".iot-controller-input").off("mouseleave");
		});
		$(".iot-controller-input").mouseleave(function(evt) {
			model.input[inputType] = false;
			$("#button-"+inputType).removeClass("iot-button-down");
			publishInput();
			$(".iot-controller-input").off("mouseup");
			$(".iot-controller-input").off("mouseleave");
		});
	});

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
			window.iot_host = response.org + ".messaging.internetofthings.ibmcloud.com";
			window.iot_port = 1883;
			window.iot_clientid = "d:"+response.org+":"+response.typeId+":"+response.deviceId;
			window.iot_username = "use-token-auth";
			window.iot_password = response.authToken;
			$("#deviceId").html(response.deviceId);
			window.client = new Paho.MQTT.Client(window.iot_host, window.iot_port, window.iot_clientid);
			connectDevice();
			//registerDevice();
		},
		error: function(xhr, status, error) {
			console.error("Could not fetch organization information.");
		}
	});
}

var bRandomize = true;

function publishAccel() {
	var res = publishMessage("iot-2/evt/accel/fmt/json", model.accel);
	$("#indicator-accel").addClass("pub");
	setTimeout(function() { $("#indicator-accel").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.accel.x += -0.1 + Math.random() * 0.2;
			model.accel.y += -0.1 + Math.random() * 0.2;
			model.accel.z += -0.1 + Math.random() * 0.2;
			$('#accel-x').slider('setValue', model.accel.x);
			$('#accel-y').slider('setValue', model.accel.y);
			$('#accel-z').slider('setValue', model.accel.z);
		}
		setTimeout(publishAccel, 500);
	}
}

function publishGyro() {
	var res = publishMessage("iot-2/evt/gyro/fmt/json", model.gyro);
	$("#indicator-gyro").addClass("pub");
	setTimeout(function() { $("#indicator-gyro").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.gyro.x += -5 + Math.random() * 10;
			model.gyro.y += -5 + Math.random() * 10;
			model.gyro.z += -5 + Math.random() * 10;
			$('#gyro-x').slider('setValue', model.gyro.x);
			$('#gyro-y').slider('setValue', model.gyro.y);
			$('#gyro-z').slider('setValue', model.gyro.z);
		}
		setTimeout(publishGyro, 500);
	}
}

function publishMag() {
	var res = publishMessage("iot-2/evt/mag/fmt/json", model.mag);
	$("#indicator-mag").addClass("pub");
	setTimeout(function() { $("#indicator-mag").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.mag.x += -0.1 + Math.random() * 0.2;
			model.mag.y += -0.1 + Math.random() * 0.2;
			model.mag.z += -0.1 + Math.random() * 0.2;
			$('#mag-x').slider('setValue', model.mag.x);
			$('#mag-y').slider('setValue', model.mag.y);
			$('#mag-z').slider('setValue', model.mag.z);
		}
		setTimeout(publishMag, 500);
	}
}

function publishTemp() {
	var res = publishMessage("iot-2/evt/temp/fmt/json", model.temp);
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
	var res = publishMessage("iot-2/evt/sys/fmt/json", model.sys);
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

function publishInput() {
	$("#indicator-input").addClass("pub");
	setTimeout(function() { $("#indicator-input").removeClass("pub"); }, 150);
	publishMessage("iot-2/evt/input/fmt/json", model.input);
}

function publishMessage(topic, payload) {
	try {
		var message = new Paho.MQTT.Message(JSON.stringify({ d: payload }));
		message.destinationName = topic;
		console.log(topic, payload);
		window.client.send(message);
		return true;
	} catch (e) {
		onConnectFailure();
	}
}

function startPublish() {
	if (isConnected) {
		publishAccel();
		publishGyro();
		publishMag();
		publishTemp();
		publishSys();
	}
}

function onConnectSuccess() {
	// The device connected successfully
	console.log("Connected Successfully!");
	isConnected = true;
	$(".connectionStatus").html("Connected");
	$(".connectionStatus").addClass("connected");

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			model.sys.location.latitude = position.coords.latitude.toFixed(6);
			model.sys.location.longitude = position.coords.longitude.toFixed(6);
			console.log(position);
			$("#latitude").val(model.sys.location.latitude);
			$("#longitude").val(model.sys.location.longitude);
			setDeviceLocation();
			startPublish();
		});
	} else {
		$("#latitude").val("n/a");
		$("#longitude").val("n/a");
		startPublish();
	}
}

function onConnectFailure() {
	// The device failed to connect. Let's try again in one second.
	console.log("Unable to connect to IoT Foundation! Trying again in one second.");
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
		onFailure: onConnectFailure,
		userName: window.iot_username,
		password: window.iot_password
	});
}

function setDeviceLocation() {
	$.ajax({
		url: "/updateDeviceLocation",
		type: "PUT",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({
			latitude: model.sys.location.latitude,
			longitude: model.sys.location.longitude
		}),
		success: function(response) {
			console.log(response);
		},
		error: function(xhr, status, error) {
			console.error(xhr, status, error);
		}
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
