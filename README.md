Apache Bahir IoT Demo
---------------------

This demo provides a Web Application that simulates devices collecting metrics from a elevetor and submits these metrics to a MQTT server using a diffeferent topic for each metric.

It also provides a Spark Application that subscribe to the MQTT topic using the Apache Bahir MQTT streaming connector.

Setting up the infrastructure
=============================

Boostraping the MQTT server
---------------------------

We boostrap a MQTT Mosquitto server using publicly available docker image

```
docker run -ti --name mosquitto -p 1883:1883 -p 127.0.0.1:9001:9001 toke/mosquitto:latest
```

If you get an error because you already have an existent exited container with the same name, issue the command below

```
docker rm -f mosquitto
```

Bostrap the web simulator
-------------------------

```
cd web-simulator/simulator
node app.js
```

**Note:** When starting for the first time, you need to use npm to install required dependencies

```
cd web-simulator/simulator
npm install
node app.js
```

Then access the simulator in your browser

```
 http://localhost:6001
```

Starting your Spark Application
-------------------------------

Now we are ready to submit our Spark Application that will subscribe to some MQTT topics and start processing data

```
cd spark-iot-analytics
bin/runStreaming.sh
```

The command above will build the application and submit it with it's required dependencies
