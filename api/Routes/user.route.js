const express = require('express');
const { test, updateRoute,deleteUser } = require('../Controllers/user.controller');
const { verifyUser } = require('../utils/verifyUser');

const userRouter = express.Router();

userRouter.get('/test', test);
userRouter.post('/update/:id', verifyUser, updateRoute)//the verify user is to check the user with the cookie in the browser for the authorization of the user
userRouter.delete('/delete/:id',verifyUser,deleteUser);

module.exports = userRouter;