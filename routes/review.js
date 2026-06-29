const express = require("express");
const router  = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//review route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));
//delete review route
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview)); 

module.exports = router;
