/**
 * This file handles basic JWT functionalities.
 *  - createToken(): Creates a new token
 *  - verifyToken(): Verifies any token
 *  - verifyAdminToken(): Verifies only 'Admin' tokens
 */



const jwt = require("jsonwebtoken");
const crypto = require('crypto');

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
        ctx.body = { error: 'Unauthorized - Invalid Token | ' + err };
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
        ctx.body = { error: 'Unauthorized - Invalid Token | ' + err };
    }
}

/**
 * Decodes a request header's 'authorization' token and returns the id.
 *
 * @param ctx - Koa context object
 * @returns {Promise<*|string>}
 */
async function getUserId(ctx) {
    const token = ctx.headers.authorization;
    if (!token) {
        return;
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        return decoded.sub;
    } catch (err) {
       return "Get User id failed"
    }
}

/**
 *
 * @param pw - password to hash
 * @returns {Promise<string>} - hashed password
 */
async function hashPw(pw) {
    return crypto.createHash('sha256').update(pw).digest('hex');
}


module.exports = { createToken, verifyToken, verifyAdminToken, getUserId, hashPw };