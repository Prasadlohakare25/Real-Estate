const User = require("../Models/user.model.js");
const bcryptjs = require('bcryptjs');

const signup = async (req, res) => {
    const { userName, name, email, password } = await req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ userName, name, email, password: hashedPassword });
    try {
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(500).json(error.message);
    }

}

module.exports = {
    signup
}