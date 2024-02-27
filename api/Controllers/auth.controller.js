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

const google = async (req, res, next) => {
    //creating a new user using the google Oauth if the user is already there then we would sign him up directly 
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECKEY)
            const { password: pass, ...rest } = user._doc;//to not show the password of the user to anyone we have destructured it and passed the rest of the data as a json(for security purposes)

            res.cookie('access_token', token, { httpOnly: true }, { expires: new Date(Date.now() + 60 * 60 * 1000) }).status(200).json(rest)//creating a cookie for authorisation and setting its age to 1 hour and http true for not giving access to any other third party app
        } else {
            const generatePassword = Math.random().toString(36).slice(-8);//creating a random password of the combination of the alphabets and the numbers and taking the last 8 digit of it to create an account
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);//hashing the password
            const newUser = new User({
                name: req.body.name,
                userName: req.body.userName.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.avatar,
            })
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECKEY)
            const { password: pass, ...rest } = newUser._doc;//to not show the password of the user to anyone we have destructured it and passed the rest of the data as a json(for security purposes)

            res.cookie('access_token', token, { httpOnly: true }, { expires: new Date(Date.now() + 60 * 60 * 1000) }).status(200).json(rest)//creating a cookie for authorisation and setting its age to 1 hour and http true for not giving access to any other third party app
        }
    } catch (error) {
        next(error)
    }
}

const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('User Logged out successfully')
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signup, signin, google, signOut
}