const router = require('koa-router')();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();


app.use(ctx => {

    ctx.body = "Hello world";
    
});


app
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080,()=>{
    console.log(`Application running on port 8080`);
});