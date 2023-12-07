const { dbAddMQTTData } = require("../services/db-mqtt");

const mqtt = require("mqtt");
const { notificationHandler } = require("./notification-service");
const options = {
  username: "green",
  password: "aCwHqUEp5J",
};
const serverIP = "163.172.151.151";
const port = "1886";
const client = mqtt.connect("mqtt://" + serverIP + ":" + port, options);

const thingy_monitor = process.env.THINGY_MONITOR;
const thingy_notification = process.env.THINGY_NOTIFICATION;

const topicSubscribeMonitor = "things/" + thingy_monitor + "/shadow/update";
const topicSubscribeNotification = 'things/' + thingy_notification + '/shadow/update';
const topicPublish = 'things/' + thingy_notification + '/shadow/update/accepted';


// Handle connection events
async function initMQTT() {
  // Connecting to MQTT Server
  client.on("connect", () => {
    console.log(
      "Connection with the MQTT broker " + serverIP + " established!"
    );
  });

  // Basic error handling
  client.on("error", (error) => {
    console.error("Something went wrong.");
    console.error(error);
  });

  // Subscribe to Thingy_Monitor topic
  client.on("connect", () => {
    // can also accept objects in the form {'topic': qos}
    client.subscribe(
        topicSubscribeMonitor,
        (err, granted) => {
        if (err) {
          console.log(err, "err");
        }
        console.log(granted, "granted");
      }
    );
  });

  // Subscribe to Thingy_Notification topic
  client.on("connect", () => {
    // can also accept objects in the form {'topic': qos}
    client.subscribe(
        topicSubscribeNotification,
        (err, granted) => {
          if (err) {
            console.log(err, "err");
          }
          console.log(granted, "granted");
        }
    );
  });

  // Handle incoming messages
  client.on("message", (topic, message) => {
    console.log(`Incoming message on topic ${topic}: ${message.toString()}`);
    //dbAddMQTTData(message, thingy_monitor);
    handleMqttData(message, topic);
  });

  // Disconnect when done
  process.on("SIGINT", () => {
    client.end();
  });

}


const appIdsMeasurements = ["AIR_QUAL", "CO2_EQUIV", "TEMP", "HUMID"];
//const appIdsDB = ["temperature", "humidity", "co2", "air_quality"];

const lt = {
  "AIR_QUAL": "air_quality",
  "CO2_EQUIV": "co2",
  "TEMP": "temperature",
  "HUMID": "humidity"
};

async function handleMqttData(message, topic) {
  const messageJson = JSON.parse(message.toString());
  const appIdValue = messageJson.appId;
  const measurement = parseFloat(messageJson.data);

  if (appIdsMeasurements.includes(appIdValue) && topic === topicSubscribeMonitor) {
    await dbAddMQTTData(measurement, appIdValue, thingy_monitor);
    await notificationHandler(measurement, lt[appIdValue]);
  }

  if (messageJson.appId === "BUTTON" && measurement === 1 && topic === topicSubscribeNotification) {
    console.log("BUTTON PRESSED!")

    // DISABLE BUZZER AND CHANGE LED BACK TO BLUE
    await disableBuzzer();
    await setLEDBlue();
  }
}



async function publish(payload) {
  client.publish(topicPublish, payload, function (err) {
    if (err) {
      console.error('Error occurred while publishing:', err);
    } else {
      console.log('Message published successfully!');
    }
  });
}

async function enableBuzzer() {
  const payload = '{"appId":"BUZZER","data":{"frequency":2000},"messageType":"CFG_SET"}';
  await publish(payload);
}

async function disableBuzzer() {
  const payload = '{"appId":"BUZZER","data":{"frequency":0},"messageType":"CFG_SET"}';
  await publish(payload);
}

async function setLEDRed() {
  const payload = '{"appId":"LED","data":{"color":"ff0000"},"messageType":"CFG_SET"}';
  await publish(payload);
}

async function setLEDBlue() {
  const payload = '{"appId":"LED","data":{"color":"0000ff"},"messageType":"CFG_SET"}';
  await publish(payload);
}



module.exports = {
  enableBuzzer,
  disableBuzzer,
  setLEDRed,
  setLEDBlue,
  initMQTT
};


