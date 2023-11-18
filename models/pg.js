const { Pool } = require("pg");
const pool = new Pool();

async function createPlantsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS public.plants
      (
        id integer NOT NULL DEFAULT nextval('plants_id_seq'::regclass),
        name character varying COLLATE pg_catalog."default",
        harvest_date timestamp with time zone,
        temperature numeric,
        humidity numeric,
        co2 numeric,
        airquality numeric,
        CONSTRAINT plants_pkey PRIMARY KEY (id)
      );
      `;

    await pool.query(query);
    console.log("Plants table created");
  } catch (err) {
    console.error(err);
    console.error("Plants table creation failed");
  }
}

async function createUsersTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS public.users
      (
        id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
        name character varying COLLATE pg_catalog."default",
        email character varying COLLATE pg_catalog."default",
        role character varying COLLATE pg_catalog."default",
        CONSTRAINT users_pkey PRIMARY KEY (id)
      );
      `;

    await pool.query(query);
    console.log("Users table created");
  } catch (err) {
    console.error(err);
    console.error("Users table creation failed");
  }
}

createPlantsTable();
createUsersTable();

module.exports = {
  pool,
};
