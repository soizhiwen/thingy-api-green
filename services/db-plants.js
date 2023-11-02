
async function dbListPlants() {
    const plants = {};

    // Retrieve Plants list from DB
    
    
    var status = 501;
    return {status, plants};
}


async function dbAddPlant(plandId, name, temp, humidity, co2, airQual, growDuration) {

    // Add Plant to DB

    // if (ok) {return 201}
    // else {return 500}
    return 501;
}


async function dbUpdatePlant(plantId, data) {

    // Update pland (plandID) with provided data
    // if (ok) {return 210}
    // else {return 500}

    return 501;
}


async function dbRemovePlant(plantId) {

    // Remove plant (plantId) from DB

    // if (ok) {return 210}
    // else {return 500}

    return 501;
}






module.exports = { dbListPlants, dbAddPlant, dbUpdatePlant, dbRemovePlant };


