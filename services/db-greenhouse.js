/**
 * This file interfaces with influxDB. It enables getting the last data point and a range of data points.
 */


require("dotenv").config();
const { queryClient } = require("../models/influx");

const bucket = process.env.INFLUX_BUCKET;
const thingyMonitor = process.env.THINGY_MONITOR;

/**
 * Gets the last measured data point from InfluxDB. The return contains the data point and a status code.
 *
 * @returns {Promise<{body: {}, status: number}>}
 */
async function dbGetLastData() {
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
  return { status: 200, body: result };
}

/**
 * Gets the data from a specified measurement type (appId) from a defined start.
 * This start denotes the time frame going back from the current time.
 *
 * @param appId - measurement type
 * @param start - how much time going back
 * @returns {Promise<{body: *[], status: number}>}
 */
async function dbGetPastData(appId, start) {
  const fluxQuery = `from(bucket: "${bucket}")
    |> range(start: -${start})
    |> filter(fn: (r) => r["_measurement"] == "mqtt_message")
    |> filter(fn: (r) => r["thingy_id"] == "${thingyMonitor}")
    |> filter(fn: (r) => r["app_id"] == "${appId}")`;

  const results = [];
  for await (const { values, tableMeta } of queryClient.iterateRows(
    fluxQuery
  )) {
    const o = tableMeta.toObject(values);
    results.push({
      value: o._value,
      timestamp: o._time,
    });
  }
  return { status: 200, body: results };
}

module.exports = { dbGetLastData, dbGetPastData };
