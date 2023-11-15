require("dotenv").config();
const { Point } = require("@influxdata/influxdb-client");
const { writeClient, queryClient } = require("../models/database");

const bucket = process.env.INFLUX_BUCKET;
const thingyMonitor = process.env.THINGY_MONITOR;


async function dbListPlantsInGh(ctx) {
    console.log("GET request to list all plants in greenhouse received!");
    // Return all plants

    const plants = {};

    // Retrieve Plants list from DB


    let status = 501;
    return {status, plants};

  }

async function dbGetData() {
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
    
    return result;
  }

  
  module.exports = { dbListPlantsInGh, dbGetData};