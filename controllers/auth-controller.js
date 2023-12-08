const router = require('koa-router')();

const { createToken } = require('../services/auth-JWT');
const { dbCreateUser, dbGetUserByEmail } = require("../services/db-users");

router.post('/login', checkLogin)
    .post('/register', registerAdmin);



async function registerAdmin(ctx) {
    console.log("POST request to register admin!");
    const adminParams = ctx.request.body;

    console.log(adminParams);
    //adminParams.role = "Admin";

    // Call DB Function
    // IMPORTANT: NEED TO CHECK FOR DOUBLE USERS
    const { status, body } = await dbCreateUser(adminParams);
    console.log("BODYYYY" + body.id);

    if (status === 201) {
        const token = await createToken(body.id, body.name, body.role);
        ctx.set({ "Access-Control-Expose-Headers": "authorization" });
        ctx.set('authorization', token);
    }
    ctx.status = status;
    ctx.body = body;
}


async function checkLogin(ctx) {
    const email = ctx.request.body.email;
    const pw = ctx.request.body.password;
    const { status, body } = await dbGetUserByEmail(email);
    if (status === 200 && pw === body.password) {
        // User Authenticated; Create Authorization Token
        const token = await createToken(body.id, body.name, body.role);

        ctx.set({ "Access-Control-Expose-Headers": "authorization" });
        ctx.set('authorization', token);
        ctx.body = body;
        ctx.status = status;
    } else {
        ctx.status = 404;
        ctx.body = "User not found.";
    }
}

module.exports = router;
