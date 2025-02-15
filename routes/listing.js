const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { viewProfile } = require('../controllers/listings');
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

// Ensure uploads directory exists
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
}

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/filter/:q", wrapAsync(listingController.filterListings));

//Search
router.get("/search", wrapAsync(listingController.search));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
