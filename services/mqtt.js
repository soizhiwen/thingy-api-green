/**
 * This file contains the main MQTT handling functions.
 */



const { dbAddMQTTData } = require("../services/db-mqtt");

const mqtt = require("mqtt");
const { notificationHandler } = require("./notification-service");
const { sendWebsocket } = require("./socketIo");
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


/**
 * Initializes the listeners for MQTT messages.
 */
async function initMQTT() {
  // Handle connection events
  // Connecting to MQTT Server
  client.on("connect", () => {
    console.log("Connection with the MQTT broker " + serverIP + " established!");
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

/**
 * Handles the incoming MQTT messages.
 *
 * @param message - the received message
 * @param topic - MQTT-topic
 */
async function handleMqttData(message, topic) {
  const messageJson = JSON.parse(message.toString());
  const appIdM = messageJson.appId;
  const measurement = parseFloat(messageJson.data);

  // If new data is received from the Monitor-thingy
  if (appIdsMeasurements.includes(appIdM) && topic === topicSubscribeMonitor) {
    await dbAddMQTTData(measurement, appIdM, thingy_monitor);
    await notificationHandler(measurement, lt[appIdM]);
    await sendWebsocket('greeenhouseData');
  }

  // If a button press is registered from the Notification-thingy
  if (messageJson.appId === "BUTTON" && measurement === 1 && topic === topicSubscribeNotification) {
    console.log("BUTTON PRESSED!")

    // Enables Buzzer and changes LED on Notification thingy
    await disableBuzzer();
    await setLEDBlue();
  }
}


/**
 * General function to publish a payload (message) to a.
 *
 * @param topic - topic to publish to
 * @param payload - message to publish
 */
async function publish(topic, payload) {
  client.publish(topic, payload, function (err) {
    if (err) {
      console.error('Error occurred while publishing:', err);
    } else {
      console.log('Message published successfully!');
    }
  });
}

/**
 * Enables the buzzer for Notification-thingy.
 */
async function enableBuzzer() {
  const payload = '{"appId":"BUZZER","data":{"frequency":2000},"messageType":"CFG_SET"}';
  await publish(topicPublish, payload);
}

/**
 * Disables the buzzer for Notification-thingy.
 */
async function disableBuzzer() {
  const payload = '{"appId":"BUZZER","data":{"frequency":0},"messageType":"CFG_SET"}';
  await publish(topicPublish, payload);
}

/**
 * Sets the LED to Blue for Notification-thingy.
 */
async function setLEDRed() {
  const payload = '{"appId":"LED","data":{"color":"ff0000"},"messageType":"CFG_SET"}';
  await publish(topicPublish, payload);
}

/**
 * Sets the LED to Red for Notification-thingy.
 */
async function setLEDBlue() {
  const payload = '{"appId":"LED","data":{"color":"0000ff"},"messageType":"CFG_SET"}';
  await publish(topicPublish, payload);
}



module.exports = {
  initMQTT
};


