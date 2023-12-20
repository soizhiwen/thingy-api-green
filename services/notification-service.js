/**
 * This file contains the logic for handling notifications to the client and thingy.
 */



const { dbListPlants } = require("./db-plants");
const { dbCreateNotification } = require("./db-notifications");


/**
 * Checks whether the measured value is within the defined range of all plants.
 *
 * @param measurement - measured value
 * @param measurementType - what kind of measurement
 */
async function checkValues(measurement, measurementType) {
    const { status, body } = await dbListPlants();  // get all plants
    let isInRange = true;
    let minMType = "min_" + measurementType;
    let maxMType = "max_" + measurementType;
    let retPlant;
    // for each plant: check if measurement is outside of min & max of plant's measurementType
    for (const plant of body) {
        isInRange = measurement >= plant[minMType] && measurement <= plant[maxMType];
        if (isInRange) {    // if inside range, return true
            // continue
        } else {            // if outside range, return false and the plant
            isInRange = false;
            retPlant = plant;
            break;
        }
    }
    return { isInRange, retPlant };
}


const mTypes = {"temperature": 0, "humidity": 0, "co2": 0, "air_quality": 0};


async function checkNotificationEvent(measurementType) {
    if (mTypes.hasOwnProperty(measurementType)) {
        mTypes[measurementType] += 1;
        if (mTypes[measurementType] >= 4) {
            // Reset the value to 0 when it reaches 4
            mTypes[measurementType] = 0;
            return true;
        } else {
            console.log("NOT YET REACHED NUMBER 4");
        }
    } else {
        // Handle the case where measurementType is not present in mTypes
        console.error("Measurement type not found:", measurementType);
    }
    return false;
}



/**
 * Main handler for notifications to client and thingy.
 *
 * @param measurement - measured value
 * @param measurementType - what kind of measurement
 */
async function notificationHandler(measurement, measurementType) {

    const { isInRange, retPlant } = await checkValues(measurement, measurementType);
    if (!isInRange) {
        if (await checkNotificationEvent(measurementType)) {

            // Create notification (& add to db)
            const message = "The " + retPlant.name + "'s value for " + measurementType +
                " is outside the defined bounds at " + measurement + "!";
            const timestamp = new Date();

            const params = {message: message, timestamp: timestamp, plant_id: retPlant.id};
            const notification = await dbCreateNotification(params);

            console.log(notification);

            // TODO: Send notification to Client (via WebSocket)


            // Set thingy_notification state

            // await require("./mqtt").enableBuzzer();
            // await require("./mqtt").setLEDRed();
        }
    }
}


module.exports = { notificationHandler };
