const router = require('koa-router')();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();


router.get('/plants/', listPlants)
    .post('/plants/', addPlant)
    .patch('/plants/:id', updatePlant)
    .del('/plants/:id', removePlant)



async function listPlants(ctx) {
    console.log("GET request to list all plants received!");
    // Return all plants
}

async function addPlant(ctx) {
    console.log("POST request to add a plants received!");
    const data = ctx.request.body;
    // Call DB Function
}

async function updatePlant(ctx) {
    console.log("PATCH request to change a plant's value received!");
    // Update in DB
}

async function removePlant(ctx) {
    console.log("DELETE request received!");
    // Remove plant from DB
}

async function addData(topic, message) {
    // Split Json Package and add in DB accordingly
}

async function deleteMeasurements() {
    // Irreversibly removes all measured data from the DB
}






/*
app.use(ctx => {

    ctx.body = "Hello world";
    
});

 */


app
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080,()=>{
    console.log(`Application running on port 8080`);
});