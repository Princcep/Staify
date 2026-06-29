const express = require("express");
const router  = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//signup form render and signup create route
router
.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));


//login form render and login create route
router
.route("/login")
.get(userController.rednerLoginForm)
.post(saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

//logout route
router.get("/logout",userController.logOut)
module.exports = router;