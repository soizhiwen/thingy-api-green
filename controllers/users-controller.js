const router = require('koa-router')();

const { dbListAdmins, dbListUsers, dbGetAdminById, dbGetUserById, dbAddAdmin, dbAddUser,
        dbUpdateAdmin, dbUpdateUser, dbRemoveAdmin, dbRemoveUser}
    = require("../services/db-users");
const { createToken, verifyToken } = require('../services/auth-JWT');

router.get('/users/admins/', verifyToken, listAdmins)
    .get('/users/', verifyToken ,listUsers)
    .get('/users/admins/:id', verifyToken, getAdminById)
    .get('/users/:id', verifyToken, getUserById)
    //.post('/users/admins/',verifyToken, registerAdmin)
    .post('/users/', verifyToken, addUser)
    .patch('/users/:id', verifyToken, updateUser)
    .patch('/users/admins/:id', verifyToken, updateAdmin)
    .del('/users/:id', verifyToken, removeUser)
    .del('/users/admin/:id', verifyToken, removeAdmin);


async function listAdmins(ctx) {
    console.log("GET request to list all Admins received!");
    const {status, admins} = await dbListAdmins();

    // Return all admins
    ctx.body = admins;
    ctx.status = status;
}


async function listUsers(ctx) {
    console.log("GET request to list all users received!");
    const {status, users} = await dbListUsers();

    // Return all users
    ctx.body = users;
    ctx.status = status;
}


async function getAdminById(ctx) {
    console.log("GET request for one Admin by ID received!");
    const adminId = ctx.params.id;
    const {status, admin} = await dbGetAdminById(adminId);

    // Return admin
    ctx.body = admin;
    ctx.status = status;
}


async function getUserById(ctx) {
    console.log("GET request for one User by ID received!");
    const userId = ctx.params.id;
    const {status, user} = await dbGetUserById(userId);

    // Return admin
    ctx.body = user;
    ctx.status = status;
}


async function addAdmin(ctx) {
    console.log("POST request to register admin!");
    const adminParams = ctx.request.body;

    // Call DB Function
    const {status, adminId} = await dbAddAdmin(adminParams);

    ctx.body = adminId;
    ctx.status = status;
}


async function addUser(ctx) {
    console.log("POST request to add a user received!");
    const userParams = ctx.request.body;

    // Call DB Function
    const {status, userId} = await dbAddUser(userParams);
    ctx.body = userId;
    ctx.status = status;
}


async function updateAdmin(ctx) {
    console.log("PATCH request to change an admin's value received!");

    const adminId = ctx.params.id;
    const updateParams = ctx.request.body;

    // Update in DB
    const status = await dbUpdateAdmin(adminId, updateParams);
    ctx.status = status;
}


async function updateUser(ctx) {
    console.log("PATCH request to change a user's value received!");

    const userId = ctx.params.id;
    const updateParams = ctx.request.body;

    // Update in DB
    const status = await dbUpdateUser(userId, updateParams);
    ctx.status = status; 
}


async function removeAdmin(ctx) {
    console.log("DELETE request received!");
    const adminId = ctx.params.id;

    // Remove admin from DB
    const status = await dbRemoveAdmin(adminId);
    ctx.status = status;
}


async function removeUser(ctx) {
    console.log("DELETE request received!");
    const userId = ctx.params.id;

    // Remove user from DB
    const status = await dbRemoveUser(userId);
    ctx.status = status;
}


module.exports=router;