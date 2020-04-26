const helper = require('../helpers')

const authenticateJWT = async (req, res, next) => {
    if (req.user.role == 1) {
       next()
    } else {
        return helper.response(res, 403, {message: "Access Denied"})
    }
};

module.exports = authenticateJWT
    