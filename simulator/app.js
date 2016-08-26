'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var credentials = require('../credentials');
var app = express();
var cfenv = require('cfenv');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var appEnv = cfenv.getAppEnv();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var config = null;

var options = {
	host: 'internetofthings.ibmcloud.com',
	port: 443,
	headers: {
	  'Content-Type': 'application/json'
	},
	auth: credentials.apiKey + ':' + credentials.apiToken
};

app.get('/credentials', function(req, res) {
	res.json(credentials);
});

app.put('/updateDeviceLocation', function(req, res) {
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;

	if (latitude === undefined || longitude === undefined) {
		res.sendStatus(500);
	}

	var options = {
		host: credentials.org + '.internetofthings.ibmcloud.com',
		port: 443,
		headers: {
		  'Content-Type': 'application/json'
		},
		auth: credentials.apiKey + ':' + credentials.apiToken,
		method: 'PUT',
		path: 'api/v0002/device/types/'+credentials.typeId+'/devices/'+credentials.deviceId+'/location'
	}

	var locationUpdate = {
		latitude: latitude,
		longitude: longitude
	}
	console.log(locationUpdate);
	var loc_req = https.request(options, function(type_res) {
		var str = '';
		type_res.on('data', function(chunk) {
			str += chunk;
		});
		type_res.on('end', function() {
			try {
				console.log(str.toString());
				res.send(JSON.parse(str));
			} catch (e) { res.sendStatus(500); }
		});
	}).on('error', function(e) { console.log("ERROR", e); });
	loc_req.write(JSON.stringify(locationUpdate));
	loc_req.end();
});

app.listen(appEnv.port || 3000, function() {
	console.log("server starting on " + appEnv.url);
});
