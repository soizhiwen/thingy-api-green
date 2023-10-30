const router = require("koa-router")();
const ctrl = require("../controllers/greenhouse-controller");

router
  .get("/greenhouse/plants/:id", ctrl.listPlants)
  .get("/greenhouse/", ctrl.getData);

module.exports = router;
