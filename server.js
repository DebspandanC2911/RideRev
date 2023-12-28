const path = require("path");
const http = require("http");
var mongoose = require("mongoose");
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketio = require("socket.io");

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
    secret: process.env.SESSION_KEY || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
app.io = io ;
// conect database
mongoose.connect('mongodb://localhost:27017/RideRev',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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


app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");


// otp route starts 
const otpRoute = require('./routes/otp')
app.use('/otp', otpRoute )
// otp route ends


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

// app.use("/public", express.static(__dirname + "/public"));
// app.set("view engine", "ejs");
// const portfolioRoute = require ('./routes/portfolio')
// app.use("/portfolio", portfolioRoute) 



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));