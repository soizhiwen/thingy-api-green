const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { getNotificationWebSocket,getGreenhouseWebSocket } = require("./services/socketIo");
const yamljs = require('yamljs');
const { koaSwagger } = require('koa2-swagger-ui');



var app = new Koa();

const initMQTT = require("./services/mqtt").initMQTT;

const spec = yamljs.load('./docs/api_documentation/API-Documentation-ASE23-GREEN-Swagger-v1.0.yaml');




//Adding the routes
const plantsRouter = require("./controllers/plants-controller");
const usersRouter = require("./controllers/users-controller");
const notificationsRouter = require("./controllers/notifications-controller");
const notificationViewsRouter = require("./controllers/notification-views-controller");
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
  .use(notificationsRouter.routes())
  .use(notificationsRouter.allowedMethods())
  .use(notificationViewsRouter.routes())
  .use(notificationViewsRouter.allowedMethods())
  .use(greenhouseRouter.routes())
  .use(greenhouseRouter.allowedMethods())
  .use(authRouter.routes())
  .use(authRouter.allowedMethods());


const server = app.listen(8080,()=>{
  console.log(`Application running on port 8080`);
});


//socket.io

const io = require('socket.io')(server,{
  cors: {
    origin: '*',
  }
});

io.on('connection',(socket)=>{
  socket.on("notificationData",()=>{
    getNotificationWebSocket(socket);
  })
  socket.on("greeenhouseData",()=>{
    getGreenhouseWebSocket(socket);
  })

})

//swagger
app.use(
  koaSwagger({
    routePrefix: '/docs', 
    swaggerOptions: {
      spec
    },
  }),
);