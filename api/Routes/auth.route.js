const express = require('express');
const { signup } = require('../Controllers/auth.model');

const authRouter = express.Router();

authRouter.post('/signup', signup)

module.exports = authRouter;