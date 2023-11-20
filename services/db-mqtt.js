
const { writeClient } = require("../models/influx");
const { Point } = require("@influxdata/influxdb-client");

//const thingyMonitor = process.env.THINGY_MONITOR;
const appIds = ["AIR_QUAL", "CO2_EQUIV", "TEMP", "HUMID"];

async function dbAddData(message, thingy_monitor) {
  const messageJson = JSON.parse(message.toString());

  if (appIds.includes(messageJson.appId)) {
    writeClient.useDefaultTags({ thingy_id: thingy_monitor });

    const point = new Point("mqtt_message").tag("app_id", messageJson.appId);
    const data = parseFloat(messageJson.data);
    fields = point.floatField("data", data);
    writeClient.writePoint(fields);
    console.log(`${fields}`);
  }
}

module.exports = { dbAddData };
