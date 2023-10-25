const router = require('koa-router')();



router.get('/plants/', listPlants)
    .post('/plants/', addPlant)
    .patch('/plants/:id', updatePlant)
    .del('/plants/:id', removePlant);



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


module.exports=router;