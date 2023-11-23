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
      text: "INSERT INTO plants(name, harvest_date, temperature, humidity, co2, air_quality) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      values: [
        params.name,
        params.harvest_date,
        params.temperature,
        params.humidity,
        params.co2,
        params.air_quality,
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
      text: "UPDATE plants SET name=$1, harvest_date=$2, temperature=$3, humidity=$4, co2=$5, air_quality=$6 WHERE id=$7 RETURNING *;",
      values: [
        params.name,
        params.harvest_date,
        params.temperature,
        params.humidity,
        params.co2,
        params.air_quality,
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
