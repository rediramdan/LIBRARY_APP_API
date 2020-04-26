const jwt = require('jsonwebtoken');
const helper = require('../helpers')

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        accessTokenSecret = process.env.API_KEY
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err && err.name === "TokenExpiredError" || err && err.name === "JsonWebTokenError") {
                return helper.response(res, 401, {message: err.name})
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT
    