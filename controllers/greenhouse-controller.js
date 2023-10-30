async function listPlants(ctx) {
  console.log("GET request to list all plants received!");
  // Return all plants
}

async function getData(ctx) {
  console.log("GET request to get Data received!");
  //let nbDataPoints = ctx.body.nbDP;
  //let valueType = ctx.body.vType;

  // GET size = nbDataPoints of value = valueType from DB

  let result = "TheDataBaseCall";

  ctx.body = result;
}

async function addData(message) {
  console.log("Adding data from MQTT transmission.");
  console.log("MQTT message to add: " + message);

  // Preliminary implementation, expansion needed ->
  // Split Json Package and add in DB accordingly

  // AddToDB !!
}

module.exports = { listPlants, getData, addData };
