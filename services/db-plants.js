

async function dbListPlants() {
    console.log("Received List Plants request.")
    const plants = {};

    // Retrieve Plants list from DB
    
    
    let status = 501;
    return {status, plants};
}


async function dbAddPlant(plantParams) {
    console.log("Received Add Plant Request with various data: " +
        plantParams.name + " " + plantParams.temp + " " + plantParams.humidity + " " +
        plantParams.co2 + " " + plantParams.airQual + " " + plantParams.growDuration);
    const plandId = "A Plant ID";
    // Add Plant to DB

    // if (ok) {return 201}
    // else {return 500}
    return 501;
}


async function dbUpdatePlant(plantId, updateParams) {
    console.log("Received Update Plant request with plant ID and data: " + plantId + " " +
        updateParams.name + " " + updateParams.temp + " " + updateParams.humidity + " " +
        updateParams.co2 + " " + updateParams.airQual + " " + updateParams.growDuration);
    // Update pland (plandID) with provided data
    // if (ok) {return 210}
    // else {return 500}

    return 501;
}


async function dbRemovePlant(plantId) {
    console.log("Plant ID: " + plantId);
    // Remove plant (plantId) from DB

    // if (ok) {return 210}
    // else {return 500}

    return 501;
}






module.exports = { dbListPlants, dbAddPlant, dbUpdatePlant, dbRemovePlant };


