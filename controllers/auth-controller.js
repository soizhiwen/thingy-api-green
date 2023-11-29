const router = require('koa-router')();

const { createToken } = require('../services/auth-JWT');
const { dbCreateUser, dbGetUserByEmail } = require("../services/db-users");

router.post('/login', checkLogin)
    .post('/register', registerAdmin);



async function registerAdmin(ctx) {
    console.log("POST request to register admin!");
    const adminParams = ctx.request.body;

    //adminParams.role = "Admin";

    // Call DB Function
    // IMPORTANT: NEED TO CHECK FOR DOUBLE USERS
    const { status, body } = await dbCreateUser(adminParams);
    console.log("BODYYYY" + JSON.stringify(body));

    if (status === 201) {
        const token = await createToken(body.id, body.name, body.role);
        ctx.set('authorization', token);
        ctx.body = { id: body.id };
    }
    ctx.status = status;
}


async function checkLogin(ctx) {
    const email = ctx.request.body.email;
    const pw = ctx.request.body.password;
    const { status, body } = await dbGetUserByEmail(email);
    if (status === 200 && pw === body.password) {
        // User Authenticated; Create Authorization Token
        const token = await createToken(body.id, body.name, body.role);

        ctx.set('authorization', token);
        ctx.body = { role: body.role, id: body.id };
    }
    ctx.status = status;
}

module.exports = router;
