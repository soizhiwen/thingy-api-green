/**
 * This file handles basic JWT functionalities.
 *  - createToken(): Creates a new token
 *  - verifyToken(): Verifies any token
 *  - verifyAdminToken(): Verifies only 'Admin' tokens
 */



const jwt = require("jsonwebtoken");

// Secret key for JWT
const jwtSecret = 'ASecret';

/**
 * Uses a 'userId', 'username', and a 'role' to create a new JWT-token expiring in '1' hour. Admin tokens are created by using 'Admin' as the role.
 *
 * @param userId
 * @param username
 * @param role
 * @returns JWT-token
 */
async function createToken (userId, username, role) {
    // Create a JWT
    const token = jwt.sign({ sub: userId, username: username, role: role }, jwtSecret, { expiresIn: '1h' });

   return token;
}

/**
 * Middleware for verifying a (any) JWT (with this secret). This Middleware adds a 'status' and, if applicable,
 *  an error message into 'body'; Both to the Koa 'ctx' object.
 *
 * @param ctx - Koa context object
 * @param next - next middleware (Koa)
 */
async function verifyToken (ctx, next) {
    console.log("Verifying token");
    const token = ctx.headers.authorization;
    //console.log("Token: " + token);
    if (!token) { // if no token is found
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized - Missing Token' };
        return;
    }

    try {   // Verify the JWT
        const decoded = jwt.verify(token, jwtSecret);
        ctx.status = 200;
        await next();
    } catch (err) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized - Invalid Token' };
    }
}

/**
 * Middleware for verifying an 'Admin' JWT (with this secret). This Middleware adds a 'status' and, if applicable,
 *  an error message into 'body'; Both to the Koa 'ctx' object.
 *
 * @param ctx - Koa context object
 * @param next - next middleware (Koa)
 */
async function verifyAdminToken(ctx, next) {
    console.log("Verifying Admin token");
    const token = ctx.headers.authorization;
    //console.log("Token: " + token);
    if (!token) { // if no token is found
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized - Missing Token' };
        return;
    }

    try {   // Verify the JWT
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded.role === 'Admin') { // Only 'Admin' tokens are allowed
            ctx.status = 200;
            await next();
        } else {
            ctx.status = 401;
            ctx.body = { error: 'Unauthorized - Access Denied!' };
        }
    } catch (err) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized - Invalid Token' };
    }
}


module.exports = { createToken, verifyToken, verifyAdminToken };