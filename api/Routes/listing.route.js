const express = require('express')
const { createListing, deleteListing, updateListing, getListing,getListings } = require('../Controllers/listing.controller');
const { verifyUser } = require('../utils/verifyUser');

const listingRouter = express.Router();

listingRouter.post('/create', verifyUser, createListing);//this is gonna verify the users first before user can do the listing of the property
listingRouter.delete('/delete/:id', verifyUser, deleteListing);
listingRouter.post('/update/:id', verifyUser, updateListing);
listingRouter.get('/getListing/:id', getListing);
listingRouter.get('/getListing', getListings);


module.exports = listingRouter;