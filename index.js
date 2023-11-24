
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");

const app = new Koa();

const initMQTT = require("./services/mqtt").initMQTT;

//Adding the routes
const plantsRouter = require("./controllers/plants-controller");
const usersRouter = require("./controllers/users-controller");
const greenhouseRouter = require("./controllers/greenhouse-controller");
const authRouter = require("./controllers/auth-controller");

initMQTT();


app
  .use(bodyParser())
  .use(cors())
  .use(plantsRouter.routes())
  .use(plantsRouter.allowedMethods())
  .use(usersRouter.routes())
  .use(usersRouter.allowedMethods())
  .use(greenhouseRouter.routes())
  .use(greenhouseRouter.allowedMethods())
    .use(authRouter.routes())
    .use(authRouter.allowedMethods());


app.listen(8080, () => {
  console.log(`Application running on port 8080`);
});




