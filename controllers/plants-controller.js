const router = require('koa-router')();

const {dbListPlants, dbAddPlant, dbUpdatePlant, dbRemovePlant} = require("../services/db-plants");



router.get('/plants/', listPlants)
    .post('/plants/', addPlant)
    .patch('/plants/:id', updatePlant)
    .del('/plants/:id', removePlant);



async function listPlants(ctx) {
    console.log("GET request to list all plants received!");
    const {status, plants} = await dbListPlants();

    // Return all plants
    ctx.body = plants;
    ctx.status = status;
}

async function addPlant(ctx) {
    console.log("POST request to add a plants received!");
    const plantParams = ctx.request.body;

    // Call DB Function
    const status = await dbAddPlant(plantParams);
    ctx.status = status;
}

async function updatePlant(ctx) {
    console.log("PATCH request to change a plant's value received!");

    const plantId = ctx.request.plantId;
    const data = ctx.request.body;

    // Update in DB
    const status = await dbUpdatePlant(plantId, data);
    ctx.status = status; 
}

async function removePlant(ctx) {
    console.log("DELETE request received!");
    const plantId = ctx.params.id;

    // Remove plant from DB
    const status = await dbRemovePlant( plantId);
    ctx.status = status;
}


module.exports=router;