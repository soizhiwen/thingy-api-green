require("dotenv").config();
const { Point } = require("@influxdata/influxdb-client");
const { writeClient, queryClient } = require("../models");

const thingyMonitor = process.env.THINGY_MONITOR;

async function listPlants(ctx) {
  console.log("GET request to list all plants received!");
  // Return all plants
}

async function getData(ctx) {
  console.log("GET request to get Data received!");
  //let nbDataPoints = ctx.body.nbDP;
  //let valueType = ctx.body.vType;

  // GET size = nbDataPoints of value = valueType from DB

  let result = "TheDataBaseCall";

  ctx.body = result;
}

async function addData(message) {
  const messageJson = JSON.parse(message.toString());
  writeClient.useDefaultTags({ thingy_id: thingyMonitor });
  const point = new Point("mqtt_message").tag("app_id", messageJson.appId);
  let fields;
  if (messageJson.appId === "LIGHT") {
    const light = messageJson.data.split(" ");
    fields = point
      .intField("a", light[0])
      .intField("b", light[1])
      .intField("c", light[2])
      .intField("d", light[3]);
  } else {
    const data = parseFloat(messageJson.data);
    fields = point.floatField("data", data);
  }
  writeClient.writePoint(fields);
  console.log(` ${fields}`);
}

module.exports = { listPlants, getData, addData };
