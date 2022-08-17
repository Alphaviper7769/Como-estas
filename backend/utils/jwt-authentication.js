const jwt = require('jsonwebtoken');
const HttpError = require('./http-error');
require('dotenv').config();

module.exports = (req, res, next) => {
    console.log(req);
    // OPTIONS method is sent to the server from the browser for certain information and hence does not require authenticating user
    if(req.method === 'OPTIONS') {
        return next();
    }

    try {
        // req.headers.authorization has a format eg -> BASIC `TOKEN`... We need that token
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return next(
                new HttpError('Authentication failed', 403)
            );
        }
        // decode the jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { userId: decoded.userId };
        next();
    } catch (err) {
        return next(
            new HttpError('Authentication failed', 403)
        );
    }
};