/*
 * Copyright (c) 2015 Luciano Resende
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
name := "spark-iot-analytics"

version := "1.0"

scalaVersion := "2.11.12"

resolvers += "Local Maven Repository" at "file://" + Path.userHome.absolutePath + "/.m2/repository"
resolvers += "Typesafe Repo" at "http://repo.typesafe.com/typesafe/releases/"
resolvers += "Sonatype Repository" at "http://oss.sonatype.org/content/repositories/releases"

// Spark dependencies as provided as they are available in spark runtime
val sparkVersion = "2.3.3"

libraryDependencies += "org.scala-lang.modules" %% "scala-xml" % "1.0.6"

libraryDependencies += "org.apache.spark" %% "spark-core" % sparkVersion  % "provided"
libraryDependencies += "org.apache.spark" %% "spark-sql" % sparkVersion  % "provided"
libraryDependencies += "org.apache.spark" %% "spark-streaming" % sparkVersion  % "provided"
libraryDependencies += "org.apache.spark" %% "spark-tags" % sparkVersion % "provided"

libraryDependencies += "org.apache.bahir" %% "spark-streaming-mqtt" % sparkVersion % "provided"
libraryDependencies += "org.apache.bahir" %% "spark-sql-streaming-mqtt" % sparkVersion % "provided"

libraryDependencies += "org.eclipse.paho" % "org.eclipse.paho.client.mqttv3" % "1.2.1"

assemblyJarName in assembly := "spark-iot-analytics.jar"
