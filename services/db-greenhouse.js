require("dotenv").config();
const { Point } = require("@influxdata/influxdb-client");
const { writeClient, queryClient } = require("../models/database");

const bucket = process.env.INFLUX_BUCKET;
const thingyMonitor = process.env.THINGY_MONITOR;


async function dbListPlants(ctx) {
    console.log("GET request to list all plants received!");
    // Return all plants
  }

async function dbGetData(ctx) {
    const result = {};
    const fluxQuery = `from(bucket: "${bucket}")
    |> range(start: 0)
    |> filter(fn: (r) => r["_measurement"] == "mqtt_message")
    |> filter(fn: (r) => r["thingy_id"] == "${thingyMonitor}")
    |> filter(fn: (r) => r["app_id"] == "AIR_QUAL" or r["app_id"] == "CO2_EQUIV" or r["app_id"] == "TEMP" or r["app_id"] == "HUMID")
    |> last()`;
  
    for await (const { values, tableMeta } of queryClient.iterateRows(
      fluxQuery
    )) {
      const o = tableMeta.toObject(values);
      result[o.app_id] = o._value;
      result.timestamp = o._time;
    }
    
    ctx.body = result;
  }
  
  async function dbAddData(message) {
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
  
  module.exports = { dbListPlants, dbGetData, dbAddData };