const router = require("koa-router")();
const { listPlants, getData } = require("../controllers/greenhouse-controller");

router.get("/greenhouse/plants/:id", listPlants).get("/greenhouse/", getData);

module.exports = router;
