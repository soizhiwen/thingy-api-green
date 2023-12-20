/**
 * This file contains the logic for handling notifications to the client and thingy.
 */


const { dbListPlants } = require("./db-plants");
const { dbCreateNotification } = require("./db-notifications");
const { sendWebsocket } = require("./socketIo");


/**
 * Checks whether the measured value is within the defined range of all plants.
 * This function cannot handle a lot of plants with the same measurementType being wrong.
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


const mTypes = {"temperature": 0, "humidity": 0, "co2": 0, "air_quality": 0}; // List of possible measurement Types
const slowDownNotification = 4; // The higher the value the slower new notifications about out of range values are sent out.

/**
 * Slows down the notification according to 'slowDownNotification' value; '1' is about 15 seconds, thus, '4' equals to about 1 minute.
 * Returns true if one measurement type has reached the same value as 'slowDownNotification'.
 * Not very effective as it doesn't account for multiple plants, but for demonstration purposes, it works.
 *
 * @param measurementType
 * @returns {Promise<boolean>}
 */
async function checkNotificationEvent(measurementType) {
    if (mTypes.hasOwnProperty(measurementType)) {
        mTypes[measurementType] += 1;
        if (mTypes[measurementType] >= slowDownNotification) {
            // Reset the value to 0 when it reaches slowDownNotification
            mTypes[measurementType] = 0;
            return true;
        } else {
            console.log("Number of notification steps of "  + measurementType + " is: " + mTypes[measurementType] + "; Needed: " + slowDownNotification);
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

            
            // Websocket call for new notification alert
            await sendWebsocket('newNotification');


            // Set thingy_notification state back to 'normal'
            await require("./mqtt").setLEDRed();
            await require("./mqtt").enableBuzzer();
        }
    }
}


module.exports = { notificationHandler };
