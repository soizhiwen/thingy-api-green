/**
 * This file handles the connection to InfluxDB.
 */



require("dotenv").config();
const { InfluxDB } = require("@influxdata/influxdb-client");

const token = process.env.INFLUX_TOKEN;
const url = process.env.INFLUX_URL;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });

const writeClient = client.getWriteApi(org, bucket, "ns");
const queryClient = client.getQueryApi(org);

module.exports = {
  writeClient,
  queryClient,
};
