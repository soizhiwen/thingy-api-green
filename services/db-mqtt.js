const {writeClient} = require("../models/database");
const {Point} = require("@influxdata/influxdb-client");

async function dbAddData(message, thingy_monitor) {
    const messageJson = JSON.parse(message.toString());
    writeClient.useDefaultTags({ thingy_id: thingy_monitor });
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

module.exports = { dbAddData };