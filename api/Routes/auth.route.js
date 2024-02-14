const express = require('express');
const { signup } = require('../Controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/signup', signup)

module.exports = authRouter;