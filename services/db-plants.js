const { pool } = require("../models/pg");

async function dbListPlants() {
  console.log("Received List Plants request.");

  try {
    const query = "SELECT * FROM plants ORDER BY id ASC;";
    const { rows } = await pool.query(query);
    return { status: 200, plants: rows };
  } catch (err) {
    console.log(err);
    return 500;
  }
}

async function dbAddPlant(params) {
  console.log(`Received Add Plant request: ${JSON.stringify(params)}`);

  try {
    const query = {
      text: "INSERT INTO plants(name, harvest_date, temperature, humidity, co2, airquality) VALUES ($1, $2, $3, $4, $5, $6);",
      values: [
        params.name,
        params.harvest_date,
        params.temperature,
        params.humidity,
        params.co2,
        params.airQuality,
      ],
    };
    await pool.query(query);
    return 201;
  } catch (err) {
    console.log(err);
    return 501;
  }
}

async function dbUpdatePlant(id, params) {
  console.log(`Received Update Plant request: ${JSON.stringify(params)}`);

  try {
    const query = {
      text: "UPDATE plants SET name=$1, harvest_date=$2, temperature=$3, humidity=$4, co2=$5, airquality=$6 WHERE id=$7 RETURNING *;",
      values: [
        params.name,
        params.harvest_date,
        params.temperature,
        params.humidity,
        params.co2,
        params.airQuality,
        id,
      ],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return 404;
    }

    return 200;
  } catch (err) {
    console.log(err);
    return 500;
  }
}

async function dbRemovePlant(id) {
  console.log(`Received Delete Plant request: ${id}`);

  try {
    const query = {
      text: "DELETE FROM plants WHERE id=$1 RETURNING *;",
      values: [id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return 404;
    }

    return 200;
  } catch (err) {
    console.log(err);
    return 500;
  }
}

module.exports = { dbListPlants, dbAddPlant, dbUpdatePlant, dbRemovePlant };
