const User = require("../Models/user.model.js");
const bcryptjs = require('bcryptjs');

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

module.exports = {
    signup
}