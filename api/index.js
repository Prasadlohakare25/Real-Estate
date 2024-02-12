const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');//to initialise env variable for security pruposes 
const authRouter = require('./Routes/auth.route');
dotenv.config();//this allows us to use those env variable

mongoose.connect(process.env.MONGO).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.log(err);
})

const app = express();
app.use(express.json());
app.use('/api/user', authRouter)

app.listen(3000, () => {
    console.log('Server is running on PORT : 3000!!');
})

