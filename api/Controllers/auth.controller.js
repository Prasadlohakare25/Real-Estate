const User = require("../Models/user.model.js");
const bcryptjs = require('bcryptjs');
const { errorHandler } = require("../utils/error.js");
const jwt = require('jsonwebtoken')

const signup = async (req, res, next) => {
    const { userName, name, email, password } = await req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ name, userName, email, password: hashedPassword });
    try {
        await newUser.save();
        res.json("Users created successfully");
    } catch (error) {
        next(error)
    }
}

const signin = async (req, res, next) => {
    const { userName, password } = await req.body;
    try {
        const validUser = await User.findOne({ userName })
        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(401, 'Wrong Credentials'));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECKEY)//creating a token for authorisation 
        const { password: pass, ...rest } = validUser._doc;//to not show the password of the user to anyone we have destructured it and passed the rest of the data as a json(for security purposes)

        res.cookie('access_token', token, { httpOnly: true }, { expires: new Date(Date.now() + 60 * 60 * 1000) }).status(200).json(rest)//creating a cookie for authorisation and setting its age to 1 hour and http true for not giving access to any other third party app
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signup, signin
}