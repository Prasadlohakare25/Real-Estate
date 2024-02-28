const express = require('express')
const { createListing } = require('../Controllers/listing.controller');
const { verifyUser } = require('../utils/verifyUser');

const listingRouter = express.Router();

listingRouter.post('/create', verifyUser, createListing);//this is gonna verify the users first before user can do the listing of the property

module.exports = listingRouter;