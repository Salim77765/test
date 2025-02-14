if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const payroute = require("./routes/payment.js");
const { url } = require("inspector");

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
    console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
        console.log("Database Not Connected!!");
        
    })

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error" , () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET||"FM3t2Ti87HEoydb0bomz5d-uuzM",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 *24 * 60 * 60 * 1000,
        maxAge: 7 *24 * 60 * 60 * 1000,
    }
};

// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// })



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/payment", payroute);
// app.use("/payment",payroute);


app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    console.log(err.stack);
    
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
    const deployURL = "http://localhost:8080";
    console.log(`App is live at ${deployURL}`);
    
    
});