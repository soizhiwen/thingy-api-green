const router = require('koa-router')();



router.get('/users/', listUsers)
    .post('/users/admin/',registerAdmin)
    .post('/users/', addUser)
    .patch('/users/:id', updateUser)
    .del('/users/:id', removeUser);


async function registerAdmin(ctx) {
        console.log("POST request to register admin!");
        // Call DB Function
}

async function listUsers(ctx) {
    console.log("GET request to list all users received!");
    // Return all users
}

async function addUser(ctx) {
    console.log("POST request to add a user received!");
    const data = ctx.request.body;
    // Call DB Function
}

async function updateUser(ctx) {
    console.log("PATCH request to change a user's value received!");
    // Update in DB
}

async function removeUser(ctx) {
    console.log("DELETE request received!");
    // Remove user from DB
}


module.exports=router;