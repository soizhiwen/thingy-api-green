const router = require('koa-router')();

const { createToken, verifyToken } = require('../services/auth-JWT');
const { dbAddAdmin, dbGetUserByUsername} = require("../services/db-users");

router.post('/login/user/', checkLoginUser)
    .post('/login/admin/', checkLoginAdmin)
    .post('/register/admin/', registerAdmin);


async function registerAdmin(ctx) {
    console.log("POST request to register admin!");
    const adminParams = ctx.request.body;

    // Call DB Function
    // IMPORTANT: NEED TO CHECK FOR DOUBLE USERS
    const {status, adminId} = await dbAddAdmin(adminParams);
    if (status === 201) {
        const token = createToken(adminId, adminParams.name);

        ctx.set('authorization', token);
        ctx.body = adminId;
    }
    ctx.status = status;
}


async function checkLoginUser(ctx) {
    const username = ctx.request.body.name
    const { status, data } = dbGetUserByUsername(username);
    console.log(data);

    if (status === 201) {
        const token = await createToken(data.id, username);
        ctx.set('authorization', token);
    }
    ctx.status = status;
}




async function checkLoginAdmin(ctx) {




}