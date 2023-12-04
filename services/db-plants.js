const { pool } = require("../models/pg");

async function dbListPlants() {
  console.log("Received List Plants request.");

  try {
    const query = "SELECT * FROM plants ORDER BY id ASC;";
    const { rows } = await pool.query(query);
    return { status: 200, body: rows };
  } catch (err) {
    return { status: 500, body: err };
  }
}

async function dbCreatePlant(params) {
  console.log(`Received Add Plant request: ${JSON.stringify(params)}`);

  try {
    const query = {
      text: "INSERT INTO plants(name, harvest_date, min_temperature, max_temperature, min_humidity, max_humidity, min_co2, max_co2, min_air_quality, max_air_quality) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;",
      values: [
        params.name,
        params.harvest_date,
        params.min_temperature,
        params.max_temperature,
        params.min_humidity,
        params.max_humidity,
        params.min_co2,
        params.max_co2,
        params.min_air_quality,
        params.max_air_quality,
      ],
    };
    const { rows } = await pool.query(query);
    return { status: 201, body: rows[0] };
  } catch (err) {
    return { status: 501, body: err };
  }
}

async function dbUpdatePlant(id, params) {
  console.log(`Received Update Plant request: ${JSON.stringify(params)}`);

  try {
    const query = {
      text: "UPDATE plants SET name=$1, harvest_date=$2, min_temperature=$3, max_temperature=$4, min_humidity=$5, max_humidity=$6, min_co2=$7, max_co2=$8, min_air_quality=$9, max_air_quality=$10 WHERE id=$11 RETURNING *;",
      values: [
        params.name,
        params.harvest_date,
        params.min_temperature,
        params.max_temperature,
        params.min_humidity,
        params.max_humidity,
        params.min_co2,
        params.max_co2,
        params.min_air_quality,
        params.max_air_quality,
        id,
      ],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return { status: 404, body: "Not found" };
    }

    return { status: 200, body: rows[0] };
  } catch (err) {
    return { status: 500, body: err };
  }
}

async function dbDeletePlant(id) {
  console.log(`Received Delete Plant request: ${id}`);

  try {
    const query = {
      text: "DELETE FROM plants WHERE id=$1 RETURNING id;",
      values: [id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return { status: 404, body: "Not found" };
    }

    return { status: 200, body: rows[0].id };
  } catch (err) {
    return { status: 500, body: err };
  }
}

module.exports = { dbListPlants, dbCreatePlant, dbUpdatePlant, dbDeletePlant };
