const router = require('koa-router')();
const crypto =  require('crypto');
const { createToken } = require('../services/auth-JWT');
const { dbCreateUser, dbGetUserByEmail } = require("../services/db-users");

router.post('/login', checkLogin)
    .post('/register', registerAdmin);



async function registerAdmin(ctx) {
    console.log("POST request to register admin!");
    let adminParams = ctx.request.body;
    adminParams.password = await hashPw(adminParams.password);

    console.log(adminParams);
    //adminParams.role = "Admin";

    // Call DB Function
    // IMPORTANT: NEED TO CHECK FOR DOUBLE USERS
    const { status, body } = await dbCreateUser(adminParams);
    console.log("BODYYYY" + body.id);

    if (status === 201) {
        const token = await createToken(body.id, body.name, body.role);
        ctx.set('authorization', token);
        ctx.body = { id: body.id, authorization: token };
    }
    ctx.status = status;
}


async function checkLogin(ctx) {
    const email = ctx.request.body.email;
    let pw = ctx.request.body.password;
    pw = await hashPw(pw);

    const { status, body } = await dbGetUserByEmail(email);
    if (status === 200 && pw === body.password) {
        // User Authenticated; Create Authorization Token
        const token = await createToken(body.id, body.name, body.role);

        //ctx.set('authorization', token);
        ctx.body = { role: body.role, id: body.id, authorization: token };
    }
    ctx.status = status;
}

/**
 *
 * @param pw - password to hash
 * @returns {Promise<string>} - hashed password
 */
async function hashPw(pw) {
    return crypto.createHash('sha256').update(pw).digest('hex');
}



module.exports = router;
