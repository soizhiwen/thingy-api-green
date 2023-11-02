
const router = require("koa-router")();
const { dbListPlants, dbGetData } = require("../services/db-greenhouse");

router.get("/greenhouse/plants/:id", listPlants).get("/greenhouse/", getData);



async function listPlants(ctx) {

  const result = await dbListPlants();

  ctx.body = result;
  ctx.status = 200;
}

async function getData(ctx) {

  const result = await dbGetData();

  ctx.body = result;
  ctx.status = 200;
}





module.exports = router;