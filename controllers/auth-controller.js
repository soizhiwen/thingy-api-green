const router = require('koa-router')();

const { createToken, verifyToken } = require('../services/auth-JWT');
const { dbCreateUser, dbGetUserByEmail } = require("../services/db-users");

router.post('/login/', checkLogin)
    //.post('/login/admin/', checkLoginAdmin)
    .post('/register/admin/', registerAdmin);


async function registerAdmin(ctx) {
    console.log("POST request to register admin!");
    const adminParams = ctx.request.body;

    // Call DB Function
    // IMPORTANT: NEED TO CHECK FOR DOUBLE USERS
    const { status, data } = await dbCreateUser(adminParams);
    if (status === 201) {
        const token = createToken(data.id, data.name, data.role);
        ctx.set('authorization', token);
        ctx.body = data.id;
    }
    ctx.status = status;
}


async function checkLogin(ctx) {
    const email = ctx.request.body.email;
    const pw = ctx.request.body.pw;
    const { status, data } = dbGetUserByEmail(email);
    console.log(data);

    if (status === 201 && pw === data.password) {
        // User Authenticated; Create Authorization Token
        const token = await createToken(data.id, data.name, data.role);
        ctx.set('authorization', token);
        ctx.body.role = data.role;
    }
    ctx.status = status;
}

