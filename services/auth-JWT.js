const jwt = require("jsonwebtoken");

// Secret key for JWT
const jwtSecret = 'ASecret';
//const jwtSecretAdmin = 'AdminSecret';

async function createToken (userId, username, role) {
    //const user = { id: userId, username: username };
    // Create a JWT
    const token = jwt.sign({ sub: userId, username: username, role: role }, jwtSecret, { expiresIn: '1h' });

   return token;
}


// Middleware for verifying a JWT
async function verifyToken (ctx, next) {

    const token = ctx.headers.authorization;

    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized - Missing Token' };
        return;
    }

    try {
        // Verify the JWT
        const decoded = jwt.verify(token, jwtSecret);
        //ctx.state.role = decoded.role; // Attach user data to the context state
        ctx.status = 200;
        await next();
    } catch (err) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized - Invalid Token' };
    }
}


async function verifyAdminToken(ctx, next) {
    const token = ctx.headers.authorization;

    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized - Missing Token' };
        return;
    }

    try {
        // Verify the JWT
        const decoded = jwt.verify(token, jwtSecret);
        //ctx.state.role = decoded.role; // Attach user data to the context state

        if (decoded.role === 'Admin') {
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