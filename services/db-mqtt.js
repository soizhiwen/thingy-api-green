
const { writeClient } = require("../models/influx");
const { Point } = require("@influxdata/influxdb-client");

//const thingyMonitor = process.env.THINGY_MONITOR;

async function dbAddMQTTData(measurement, appIdValue, thingy_monitor) {

    writeClient.useDefaultTags({ thingy_id: thingy_monitor });
    const point = new Point("mqtt_message").tag("app_id", appIdValue);
    fields = point.floatField("data", measurement);
    writeClient.writePoint(fields);
    console.log(`${fields}`);
}

module.exports = { dbAddMQTTData };
