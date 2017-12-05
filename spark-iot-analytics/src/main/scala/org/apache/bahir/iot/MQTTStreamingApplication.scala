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

import org.apache.spark.storage.StorageLevel
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.streaming.mqtt._
import org.apache.spark.SparkConf

// scalastyle:off println
object MQTTStreamingApplication {

  def main(args: Array[String]) {
    if (args.length < 2) {
      System.err.println(
        "Usage: MQTTWordCount <MqttbrokerUrl> <topic>")
      System.exit(1)
    }

    val Seq(brokerUrl, topic) = args.toSeq
    
    println(">>> mqtt server " + brokerUrl)
    println(">>> topic       " + topic)
    
    val sparkConf = new SparkConf()
        .setAppName("MQTT IoT Analytics")
        .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
        .registerKryoClasses(Array(classOf[Timestamp]))

    val streamingContext = new StreamingContext(sparkConf, Seconds(5))
    val powerMeasures =
      MQTTUtils.createStream(streamingContext, brokerUrl, topic, StorageLevel.MEMORY_ONLY_SER_2)

    powerMeasures.print()
    
    // val values = powerMeasures.flatMap(x => x.split(" "))
    
    // values.print()
    
    

    // val powerWindow = powerMeasures.window(Seconds(30))

    /*
    powerMeasures.foreachRDD { rdd =>
      if( rdd.isEmpty ) {
        println(">>> Empty RDD")
      }
      
      rdd.foreach( measure => println(">>> power : " + measure))
    }
    */

    streamingContext.start()
    streamingContext.awaitTermination()
  }
}
// scalastyle:on println