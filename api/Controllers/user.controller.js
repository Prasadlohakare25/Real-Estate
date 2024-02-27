const { errorHandler } = require("../utils/error")
const bcryptjs = require('bcryptjs')
const User = require('../Models/user.model')

const test = (req, res) => {
    res.json({ message: 'Api route is working ' })
}

const updateRoute = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account"))//if the user does not match with the requested user

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }//encrypting the new password with the bcryptjs hashing 

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }//this can allow us to change only one attribute also 
        }, { new: true })//new true will update and save the updated user object
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        console.log("there is some error in this")
        next(error)
    }
}

module.exports = {
    test, updateRoute
}