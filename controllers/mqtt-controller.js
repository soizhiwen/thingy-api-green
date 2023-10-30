const greenhouseController = require("./greenhouse-controller");

const mqtt = require("mqtt");
const options = {
  username: "green",
  password: "aCwHqUEp5J",
};
const serverIP = "163.172.151.151";
const port = "1886";
const client = mqtt.connect("mqtt://" + serverIP + ":" + port, options);

const thingy_monitor = "green-1";
const thingy_notification = "green-2";

//initMQTT();

// Handle connection events
async function initMQTT() {
  client.on("connect", () => {
    console.log(
      "Connection with the MQTT broker " + serverIP + " established!"
    );
  });

  client.on("error", (error) => {
    console.error("Something went wrong.");
    console.error(error);
  });

  // Subscribe to a topic
  client.on("connect", () => {
    // can also accept objects in the form {'topic': qos}
    client.subscribe(
      "things/" + thingy_monitor + "/shadow/update",
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
    greenhouseController.addData(message);
  });

  // Disconnect when done
  process.on("SIGINT", () => {
    client.end();
  });
}

module.exports = initMQTT;

/*

const payload = '{"appId":"BUZZER","data":{"frequency":2000},"messageType":"CFG_SET"}';
const topic_LED = 'things/green-1/shadow/update/accepted/';

async function send() {
    console.log("Message");
    client.publish(topic_LED, JSON.stringify(payload));
};
// Publish a message
//client.publish(topicName, JSON.stringify(payload), {qos: 1, retain: true}
setTimeout(send, 2000);

 */
