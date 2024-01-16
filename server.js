const path = require("path");
const http = require("http");
var mongoose = require("mongoose");
const Article = require('./models/articles')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const express = require("express");
const socketio = require("socket.io");
const bodyParser = require('body-parser');
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const redis = require("redis");
const dotenv = require('dotenv').config();
const cron = require('node-cron')
const moment = require('moment')
const cookieParser = require('cookie-parser');
const { createClient } = redis;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(cookieParser());
// Set static folder
app.use(express.static(path.join(__dirname, "public")));
// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '5mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
const session = require('express-session');
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.io = io ;
// conect database
mongoose.connect('mongodb://localhost:27017/RideRev');
var db = mongoose.connection;

// check connect

db.on('error', () => console.log("error in connecting database"));
db.once('open', () => console.log("Connected to Database"));

// userlogin route
const userlogin = require('./routes/login')
app.use('/login', userlogin)
// userlogin route ends
//user_signup route
const UserSignup = require('./routes/Users_Signup')
app.use('/sign_up', UserSignup)
//==============================


// home page route starts
const homePage = require('./routes/home')
app.use('/', homePage)
// home page route ends 
//Blog

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

// route for the crypto_dashbaord page ends
app.get('/blog', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})


app.use('/articles', articleRouter)

app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// The portfolio route
// const portfolioRoute = require('./routes/portfolio');
// app.use('/portfolio', portfolioRoute);
// const portfolioRoute = require ('./routes/portfolio')
// app.use("/portfolio", portfolioRoute) 
  
app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");


const paymentRoute= require('./routes/payment')
app.use('/add_money', paymentRoute)

const portfolioRoute = require('./routes/portfolio');
app.use('/portfolio', portfolioRoute);


const pdfdownload = require ('./routes/generatepdf')
app.use('/generatepdf', pdfdownload) 




const paymentSuccess = require ('./routes/paymentSuccess')
app.use('/payment-success', paymentSuccess);
app.get("/contact", function (request, result) {
  result.render("contact");
});

// transaction route starts
const transactionRoute = require ('./routes/transaction')
app.use("/transactions", transactionRoute);
// transaction route ends


// otp route starts
const otpRoute = require('./routes/otp')
app.use('/otp', otpRoute )
// otp route ends

app.get("/pricing", function (request, result) {
  result.render("pricing");
});

app.get("/services", function (request, result) {
  result.render("services");
});

// logout route
const logoutRoute = require('./routes/logout');
app.use('/logout', logoutRoute)
// logout route ends

// forget password route starts
const forgetPasswordRoute = require('./routes/forgetpassword')
app.use('/forgetpassword', forgetPasswordRoute)

// forget password route ends
// route for the reset password starts
const ResetPasswordRoute = require ('./routes/resetpassword')
app.use('/resetpassword', ResetPasswordRoute)
// route for reset password ends


// Route for the UserProfile Route
const UserProfileRoute = require('./routes/userProfile')
app.use('/userprofile', UserProfileRoute)
// Route for UserProfile ends

// Route for the updating UserProfile Route
const UpdateUserProfileRoute = require('./routes/updateprofile')
app.use('/updateuserprofile', UpdateUserProfileRoute)
// Route for UserProfile ends


// googlesignup route ends
const googlesignupRoute = require('./routes/googlesignup')
app.use('/googlesignup', googlesignupRoute)
// google singup route ends

// google login authentication route starts
const googleRoute = require('./routes/googlelogin')
app.use('/auth/google', googleRoute)
// google login authentication route ends

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));