const { dbAddData } = require("../services/db-mqtt");

const mqtt = require("mqtt");
const options = {
  username: "green",
  password: "aCwHqUEp5J",
};
const serverIP = "163.172.151.151";
const port = "1886";
const client = mqtt.connect("mqtt://" + serverIP + ":" + port, options);

const thingy_monitor = "green-1";
const thingy_notification = "green-1";

const topicSubscribe = "things/" + thingy_monitor + "/shadow/update";
const topicPublish = 'things/' + thingy_notification + '/shadow/update/accepted';

test();

async function test() {
  initMQTT();
  await sleep(5000);
  enableBuzzer();
  await sleep(5000);
  disableBuzzer();
  await sleep(5000);
  setLEDRed();
  await sleep(5000);
  setLEDBlue();
};


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
        topicSubscribe,
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
    //dbAddData(message, thingy_monitor);
  });

  // Disconnect when done
  process.on("SIGINT", () => {
    client.end();
  });

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



function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(ms) {
  console.log("Senpai, I'll wait for " + ms/1000 + "seconds! ☆〜（ゝ。∂）");

  await delay(ms); // Here we wait for 2 seconds (2000 milliseconds)

  console.log("Yay! " + ms/1000 + "seconds have passed! ٩(◕‿◕｡)۶");
}


module.exports = { enableBuzzer, disableBuzzer, setLEDRed, setLEDBlue, initMQTT };


