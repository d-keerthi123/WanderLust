const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const { populate } = require("../models/reviews.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

//index route & create route
router.route("/")
.get(wrapAsync(listingController.index))
// .post(isLoggedIn,validateListing, wrapAsync (listingController.createListing));
.post(upload.single('listing[image][url]'),(req,res)=>{
    res.send(req.file);
})

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show route , update route & delete route
router.route("/:id")
.get(wrapAsync (listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync (listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync (listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync (listingController.renderEditForm));


module.exports=router;