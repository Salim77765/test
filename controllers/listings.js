const Listing = require("../models/listing");
const User = require("../models/user");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const fetch = require("node-fetch");
const path = require('path');
const fs = require('fs');

const mapToken = process.env.MAP_TOKEN;
console.log(mapToken);
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};



module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
      .populate("owner") // Ensure owner details are fetched
      .populate({
          path: "reviews",
          populate: { path: "author" },
      });

  if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
  }

  console.log("Listing Owner:", listing.owner); // Debugging

  res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
  try {
    // Log file details for debugging
    console.log('File received:', req.file);
    console.log('Request body:', req.body);

    // Verify uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.error('Uploads directory does not exist:', uploadsDir);
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    if (req.file) {
      // More robust file path handling
      const relativePath = path.relative(process.cwd(), req.file.path);
      
      if (!fs.existsSync(req.file.path)) {
        throw new Error(`File does not exist: ${req.file.path}`);
      }

      newListing.image = { 
        url: `/uploads/${req.file.filename}`, 
        filename: req.file.filename 
      };
    } else {
      req.flash('error', 'Image is required');
      return res.redirect('/listings/new');
    }

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error('Listing creation error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      fileName: err.fileName,
      lineNumber: err.lineNumber
    });
    req.flash('error', `Something went wrong: ${err.message}`);
    res.redirect('/listings/new');
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.listing.location},${req.body.listing.country}`,
      limit: 2,
    })
    .send();

  req.body.listing.geometry = response.body.features[0].geometry;
  console.log(req.body.listing.geometry);
  let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    updatedListing.save();
  }
  req.flash("success", "Listing Updated !!");
  res.redirect(`/listings/${id}`);
};

module.exports.filterListings = async (req, res, next) => {
  const { q } = req.params;
  const filteredListings = await Listing.find({ category: q }).exec();
  if (!filteredListings.length) {
    req.flash("error", "No Listings exists for this filter!");
    res.redirect("/listings");
    return;
  }
  res.locals.success = `Listings Filtered by ${q}`;
  res.render("listings/index.ejs", { allListings: filteredListings });
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

module.exports.search = async (req, res) => {
  console.log(req.query.q);
  let input = req.query.q.trim().replace(/\s+/g, " "); //remove start and end space
  console.log(input);
  if (input == "" || input == " ") {
    //search value is empty
    req.flash("error", "Search value empty!!!");
    res.redirect("/listings");
  }

  //convert every word first letter capital and other small
  let data = input.split("");
  let element = "";
  let flag = false;
  for (let index = 0; index < data.length; index++) {
    if (index == 0 || flag) {
      element = element + data[index].toUpperCase();
    } else {
      element = element + data[index].toLowerCase();
    }
    flag = data[index] == " ";
  }
  console.log(element);

  let allListings = await Listing.find({
    title: { $regex: element, $options: "i" },
  });
  if (allListings.length != 0) {
    res.locals.success = "Listings searched by title";
    res.render("listings/index.ejs", { allListings });
    return;
  }
  if (allListings.length == 0) {
    allListings = await Listing.find({
      category: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by category";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    allListings = await Listing.find({
      country: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by country";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    allListings = await Listing.find({
      location: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by location";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }

  const intValue = parseInt(element, 10); //10 for decimal return - int ya NaN
  const intDec = Number.isInteger(intValue); //check intValue is number or not

  if (allListings.length == 0 && intDec) {
    allListings = await Listing.find({ price: { $lte: element } }).sort({
      price: 1,
    });
    if (allListings.length != 0) {
      res.locals.success = `Listings searched for less than Rs ${element}`;
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    req.flash("error", "Listings is not here !!!");
    res.redirect("/listings");
  }
};
