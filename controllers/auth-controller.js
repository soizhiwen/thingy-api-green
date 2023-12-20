/**
 * This file contains wrapper functions to interface with HTTP requests - register and login.
 */


const router = require('koa-router')();
const { createToken, hashPw } = require('../services/auth-JWT');
const { dbCreateUser, dbGetUserByEmail } = require("../services/db-users");

router.post('/register', registerAdmin)
    .post('/login', checkLogin);


/**
 * This middleware registers a user needing a 'name', an 'email', a 'password', and 'role' in the body. If the new user is added to
 *  the DB successfully, a JWT-token is created and added to the 'authorization' header. Additionally, the response
 *  will contain a body with the user (or an error) and a status code.
 *
 * @param ctx - Koa context object
 */
async function registerAdmin(ctx) {
    console.log("POST request to register admin!");
    let adminParams = ctx.request.body;

    // Call DB Function to create a User
    const { status, body } = await dbCreateUser(adminParams);
    if (status === 201) { // Successful Creation of User
        const token = await createToken(body.id, body.name, body.role);
        ctx.set({ "Access-Control-Expose-Headers": "authorization" });
        ctx.set('authorization', token);
    }
    ctx.status = status;
    ctx.body = body;
}

/**
 * This middleware necessitates an 'email' and a 'password' and checks if a user with this email exists and has
 *  the same password. If the user is authenticated, a JWT-token is created and added to the 'authorization' header.
 *  Additionally, the response will contain a body with the user (or an error) and a status code.
 *
 * @param ctx - Koa context object
 */
async function checkLogin(ctx) {
    console.log("Checking Login!");
    const email = ctx.request.body.email;
    let pw = ctx.request.body.password;
    pw = await hashPw(pw);

    const { status, body } = await dbGetUserByEmail(email);
    if (status === 200 && pw === body.password) { // User exists and the password is matching
        // Create Authorization Token
        const token = await createToken(body.id, body.name, body.role);
        ctx.set({ "Access-Control-Expose-Headers": "authorization" });
        ctx.set('authorization', token);
        ctx.body = body;
        ctx.status = status;
    } else {
        ctx.status = 404;
        ctx.body = "ERROR " + body;
    }
}


module.exports = router;
