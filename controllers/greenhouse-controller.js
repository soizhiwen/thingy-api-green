const router = require('koa-router')();



router.get('/greenhouse/:id', listPlants);



async function listPlants(ctx) {
    console.log("GET request to list all plants received!");
    // Return all plants
}



module.exports=router;