#!/usr/bin/env bash
#
# Copyright (c) 2016 - 2017 Luciano Resende
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

ps aux |grep "spark-iot-analytics" | tr -s " " |  cut -d " " -f 2 | xargs kill >/dev/null 2>&1

# using environment variable to find Spark & Hadoop home directory
if [ -z "$HADOOP_HOME" ]; then echo "$HADOOP_HOME is NOT set"; else echo "HADOOP_HOME defined as '$HADOOP_HOME'"; fi
if [ -z "$SPARK_HOME" ]; then echo "SPARK_HOME is NOT set"; else echo "SPARK_HOME defined as '$SPARK_HOME'"; fi

HOSTNAME="$(/bin/hostname -f)"
SCALA_VERSION=2.11

echo "Starting Spark Application at $SPARK_HOME"

#weight
#Structured Streaming
$SPARK_HOME/bin/spark-submit --master spark://$HOSTNAME:7077 --packages org.apache.bahir:spark-sql-streaming-mqtt_2.11:2.3.2 --jars ./lib/org.eclipse.paho.client.mqttv3-1.2.1.jar --class org.apache.bahir.iot.MQTTSQLStreamingApplication  ./target/scala-2.11/spark-iot-analytics_2.11-1.0.jar tcp://localhost:1883 bahir/iot/id/simulator/evt/weight
