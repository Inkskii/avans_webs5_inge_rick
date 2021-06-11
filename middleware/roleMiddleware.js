const jwt = require("jsonwebtoken");

exports.authenticateRole = (rolesArray) => (req, res, next) => {
    let decoded = jwt.verify(req.body["secret_token"], "TOP_SECRET");
    let authorized = false;
    const roleName = decoded.user.role;

    rolesArray.forEach(role => {

        authorized = roleName === role;
    })
    if (authorized) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: 'Unauthorized',
    })
};