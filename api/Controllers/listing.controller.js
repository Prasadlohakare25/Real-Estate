const Listing = require("../Models/listing.model");
const { findByIdAndUpdate } = require("../Models/user.model");
const { errorHandler } = require("../utils/error");


const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, "Listing not found"))
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only delete your own lisitng"));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Lisitng deleted successfully");
    } catch (error) {
        next(error);
    }
}

const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, "Listing not found"))
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only update your own lisitng"));
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id,
            req.body,
            { new: true });
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}

const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return next(errorHandler(404, "Listing not found"))
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

const getListings = async (req, res, next) => { // Async function to handle fetching listings
    try {
        // Parsing query parameters from the request
        const limit = parseInt(req.query.limit) || 9; // Limit of listings per page, default 9
        const startIndex = parseInt(req.query.startIndex) || 0; // Starting index of listings, default 0

        // Parsing and setting the 'offer' parameter
        let offer = req.query.offer; // Offer parameter (true/false)

        // Check if offer is not provided or set to 'false', then set to an array containing [false, true]
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        // Parsing and setting the 'furnished' parameter
        let furnished = req.query.furnished; // Furnished parameter (true/false)

        // Check if furnished is not provided or set to 'false', then set to an array containing [false, true]
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        // Parsing and setting the 'parking' parameter
        let parking = req.query.parking; // Parking parameter (true/false)

        // Check if parking is not provided or set to 'false', then set to an array containing [false, true]
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        // Parsing and setting the 'type' parameter
        let type = req.query.type; // Type parameter ('sale', 'rent', or 'all')

        // Check if type is not provided or set to 'all', then set to an array containing ['sale', 'rent']
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        // Parsing and setting the 'searchTerm' parameter
        const searchTerm = req.query.searchTerm || ''; // Search term parameter

        // Parsing and setting the 'sort' parameter
        const sort = req.query.sort || 'createdAt'; // Sorting parameter, default to 'createdAt'

        // Parsing and setting the 'order' parameter
        const order = req.query.order || 'desc'; // Sorting order parameter, default to 'desc'

        // Execute MongoDB query to find listings based on criteria
        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' }, // Perform case-insensitive search on 'name' field using regex
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order }) // Sort results based on sort field and order
            .limit(limit) // Limit the number of results
            .skip(startIndex); // Skip the specified number of results

        return res.status(200).json(listings); // Send retrieved listings as JSON response
    } catch (error) {
        next(error); // Handle errors
    }
};

// { $regex: searchTerm, $options: 'i' }: This part of the code constructs a MongoDB query using regular expressions to perform a case-insensitive search on the 'name' field of the listings.
// $regex: Specifies the regular expression pattern to search for. In this case, it uses the value of the searchTerm parameter.
// $options: 'i': Specifies options for the regular expression. The 'i' option makes the search case-insensitive, meaning it will match both uppercase and lowercase letters.


// The $in function in MongoDB is an operator used to specify a condition where the field value must match any of the values specified in an array. 
module.exports = {
    createListing, deleteListing, updateListing, getListing, getListings
}