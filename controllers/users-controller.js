const router = require('koa-router')();

const {dbListUsers, dbAddUser, dbUpdateUser, dbRemoveUser, dbRegisterAdmin} = require("../services/db-users");

router.get('/users/', listUsers)
    .post('/users/admin/',registerAdmin)
    .post('/users/', addUser)
    .patch('/users/:id', updateUser)
    .del('/users/:id', removeUser);


async function listUsers(ctx) {
    console.log("GET request to list all users received!");
    const {status, users} = await dbListUsers();

    // Return all plants
    ctx.body = users;
    ctx.status = status;
}


async function registerAdmin(ctx) {
    console.log("POST request to register admin!");
    const data = ctx.request.body;

    // Call DB Function
    const status = await dbRegisterAdmin(data);

    ctx.status = status;
}


async function addUser(ctx) {
    console.log("POST request to add a user received!");
    const userParams = ctx.request.body;

    // Call DB Function
    const status = await dbAddUser(userParams);
    ctx.status = status;
}


async function updateUser(ctx) {
    console.log("PATCH request to change a user's value received!");

    const userId = ctx.request.userId;
    const data = ctx.request.body;

    // Update in DB
    const status = await dbUpdateUser(userId, data);
    ctx.status = status; 
}


async function removeUser(ctx) {
    console.log("DELETE request received!");
    const userId = ctx.params.userId;

    // Remove plant from DB
    const status = await dbRemoveUser(userId);
    ctx.status = status;
}


module.exports=router;