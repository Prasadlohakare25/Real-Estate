const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');//to initialise env variable for security pruposes 
const authRouter = require('./Routes/auth.route');
const cookieParser = require('cookie-parser');
const userRouter = require('./Routes/user.route');
const listingRouter = require('./Routes/listing.route')
dotenv.config({ path: '../.env' });//this allows us to use those env variable
// process.env.MONGO
mongoose.connect(process.env.MONGO).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.log(err);
})

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/listing', listingRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

app.listen(3000, () => {
    console.log('Server is running on PORT : 3000!!');
})

