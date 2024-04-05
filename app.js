const express = require("express")
const app = express();
const mongoose = require("mongoose")
// const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
// const wrapAsync = require('./utils/wrapAsync.js');
const expressError = require('./utils/expressError.js');
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")


// const { error } = require("console");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

const listingsRouters = require("./routes/listing.js");
const reviewsRouters = require("./routes/review.js");
const userRouters = require("./routes/user.js");

main()
  .then((res) => {
    console.log("connection sucessfull");
  })
  .catch((err) => {
    console.log(err)
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //for parse data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions={
  secret:"mysupersecret",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}

app.get("/", (req, res) => {
  res.send("root is working")
})


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curruser=req.user;
  console.log(res.locals.success);
  next();
})
// app.get("/demouser", async(req,res)=>{
//   let fakeUser=new User({
//     email:"abc@gamil.com",
//     username:"vikanshu",
//   });
//   let registerUser= await User.register(fakeUser,"password");
//   res.send(registerUser);

// })
app.use("/listings", listingsRouters)
app.use("/listings/:id/reviews", reviewsRouters)
app.use("/", userRouters)


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


// when route value is not match 
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page not found"));

});

// Express error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  // res.render("error.ejs",{message});
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
})

// custom error handler-> middleware
app.use((err, req, res, next) => {
  res.send("Something went wrong");
})
app.listen(3000, () => {
  console.log("server is listening to port 3000")
})