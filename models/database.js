require("dotenv").config();
const { InfluxDB } = require("@influxdata/influxdb-client");

const token = 'Rcnl09Tai1I6Nc7-D24-_qxWcps7KOJK_fjUMZKomZhEOF9zkfyOm1DZ3kMAAx2wcry41tUMlxBNBazgMocPUQ==';
const url = 'http://localhost:8086';
const org = `ASE - AS23`;
const bucket = `Test Bucket`;

const client = new InfluxDB({ url, token });

const writeClient = client.getWriteApi(org, bucket, "ns");
const queryClient = client.getQueryApi(org);

module.exports = {
  writeClient,
  queryClient,
};
