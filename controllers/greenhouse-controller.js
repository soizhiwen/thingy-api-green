
const router = require("koa-router")();
const { dbListPlants, dbGetData } = require("../services/db-greenhouse");

router.get("/greenhouse/plants/:id", listPlants).get("/greenhouse/", getData);



async function listPlants(ctx) {

  dbListPlants();


}

async function getData(ctx) {

  dbGetData(ctx);


}





module.exports = router;