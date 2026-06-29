const User = require("../models/user.js");
module.exports.renderSignUpForm =(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
    const newUser = new User({email,username})
    const registeredUser = await User.register(newUser,password)
    // console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
           return next(err);
        }
    });
    req.flash("success","Welcome to Staify");
    res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module.exports.rednerLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async (req,res)=>{
    req.flash("success","welcome back");
    res.redirect(res.locals.redirectUrl ||"/listings");
};

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
    });
    req.flash("success","You are logged out");
    res.redirect("/listings");
};