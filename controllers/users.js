const User = require("../models/user");
const Listing = require("../models/listing");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.redirect = (req,res) => {
    res.redirect("/listings");
}



module.exports.signup = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "welcome to Kisaan Setu");
            res.redirect("/listings");

        })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};




module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "welcome back to Farm!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.viewProfile = async (req, res) => {
    
    try {
        // Assuming that the User model is already required at the top of the file
        const userId = req.user._id;
        const user = await User.findById(userId).populate('listings').exec();
        const listing = await Listing.findById(userId);
        if(!listing){
            req.flash("No listings!!")
        }

        if (!user) {
            req.flash("error", "User profile not found!");
            return res.redirect("/");
        }

        res.render("users/profile.ejs", { user, listing });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        req.flash("error", "An error occurred while fetching the profile.");
        res.redirect("/");
    }
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};

