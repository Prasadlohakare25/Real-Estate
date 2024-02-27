const { errorHandler } = require("./error");
const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, "Unauthorized"));//is the token is not there in the browser

    jwt.verify(token, process.env.JWT_SECKEY, (err, user) => {
        if (err) return next(errorHandler(402, 'Forbidden'));//if some error happens in the middle of the verification

        req.user = user;
        next();//continue if everything goes well
    })
}

module.exports = {
    verifyUser
}