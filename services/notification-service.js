//const { enableBuzzer, setLEDRed } = require("./mqtt");
const { dbListPlants } = require("./db-plants");
const { dbCreateNotification } = require("./db-notifications");

/**
 * WHAT WE NEED:
 *
 * - Logic: Depending on the thingy/sensor data, send notification to client and activate
 *      thingy/notification with respective behaviour (buzzer, LED)
 */


async function checkValues(measurement, measurementType) {

    // get all plants
    const { status, body } = await dbListPlants();
    //console.log("Measurement: " + measurement);
    let isInRange = true;
    let plantId = -1;

    // for each plant: check if measurement is outside of min & max of plant's measurementType
    for (const plant of body) {
        isInRange = measurement === plant[measurementType];
        // if inside range, return true
        // if outside range, return false
        if (isInRange) {
            // continue
        } else {
            isInRange = false;
            plantId = plant.id;
            break;
        }
    }

    return { isInRange, plantId };
}



async function notificationHandler(measurement, measurementType) {

    const { isInRange, plantId } = await checkValues(measurement, measurementType);
    if (!isInRange && plantId !== -1) {

        // Create notification (& add to db)
        const message = "Message";
        const timestamp = new Date();
        var userId = 1;

        const params = {message: message, timestamp: timestamp, plant_id: plantId, user_id: userId};
        //const notification = await dbCreateNotification(params);

        //console.log(notification);

        // TODO: Send notification to Client (via WebSocket)



        // Set thingy_notification state

        // await require("./mqtt").enableBuzzer();
        // await require("./mqtt").setLEDRed();
    }
}


module.exports = { notificationHandler };
















// THINGY

