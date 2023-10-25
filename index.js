const router = require('koa-router')();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();


//Adding the routes
const plantsRouter= require('./controllers/plants-controller');





app
  .use(bodyParser())
  .use(cors())
  .use(plantsRouter.routes()).use(plantsRouter.allowedMethods());

app.listen(8080,()=>{
    console.log(`Application running on port 8080`);
});