const jwt = require("jsonwebtoken");

// Secret key for JWT
const jwtSecret = 'dick123';

async function createToken (userId, username) {
    const user = { id: userId, username: username };
    // Create a JWT
    const token = jwt.sign({ sub: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' });

   return token;
}


// Middleware for verifying a JWT
async function verifyToken (ctx, next) {
    //console.log(ctx.headers.authorization);
    const token = ctx.headers.authorization;
    //console.log(token);
    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized - Missing Token' };
        return;
    }

    try {
        // Verify the JWT
        const decoded = jwt.verify(token, jwtSecret);
        ctx.state.user = decoded; // Attach user data to the context state
        ctx.status = 200;
        await next();
    } catch (err) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized - Invalid Token' };
    }
}


module.exports = { createToken, verifyToken };