const { writeClient, queryClient } = require("./models");

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");

const app = new Koa();

const initMQTT = require("./controllers/mqtt-controller");

//Adding the routes
const plantsRouter = require("./controllers/plants-controller");
const usersRouter = require("./controllers/users-controller");
const greenhouseRouter = require("./routers/greenhouse-router");

initMQTT();

app
  .use(bodyParser())
  .use(cors())
  .use(plantsRouter.routes())
  .use(plantsRouter.allowedMethods())
  .use(usersRouter.routes())
  .use(usersRouter.allowedMethods())
  .use(greenhouseRouter.routes())
  .use(greenhouseRouter.allowedMethods());

app.listen(8080, () => {
  console.log(`Application running on port 8080`);
});
