/*
 * Copyright (c) 2016 - 2017 Luciano Resende
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
package org.apache.bahir.iot

import java.sql.Timestamp

import org.apache.spark.sql.SparkSession
import org.apache.spark.network.protocol.Encoders
import org.apache.spark.storage.StorageLevel
import org.apache.spark.streaming.dstream.DStream
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.streaming.mqtt.MQTTUtils

// scalastyle:off println
object MQTTSQLStreamingApplication {

  def main(args: Array[String]) {
    if (args.length < 2) {
      System.err.println(
        "Usage: MQTTWordCount <MqttbrokerUrl> <topic>")
      System.exit(1)
    }

    val Seq(brokerUrl, topic) = args.toSeq
    
    val spark = SparkSession.builder()
        .appName("MQTT IoT Analytics")
        .getOrCreate();

    import spark.implicits._

    val powerMetrics = spark.readStream
        .format("org.apache.bahir.sql.streaming.mqtt.MQTTStreamSourceProvider")
        .option("topic", topic)
        .load(brokerUrl)
        .selectExpr("CAST(id AS INT)", "CAST(topic AS STRING)", "CAST(payload AS STRING)", "timestamp as timestamp")
        .as[(Int, String, String, Timestamp)]

    val query = powerMetrics.writeStream
        .outputMode("append")
        .format("console")
        .start()

    query.awaitTermination();
  }
}
// scalastyle:on println