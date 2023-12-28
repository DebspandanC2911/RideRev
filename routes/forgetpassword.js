const express = require('express')
const router = express.Router();
const User = require('../models/user')
const nodemailer = require('nodemailer')
const {encrypt,decrypt} = require ('../controllers/security')
function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
  }
router.get('/', async (req, res) => {
     
    res.render('forgetpassword.ejs')
})
router.post('/', async (req, res) => {
    const email = req.body.email;
    const userData = User.findOne({ email: email });
    if (!userData) {
        return res.status(400).json({
            success: false,
            message: "Email not Registered with us"
        })
    }
    else {
        const encryptedText = encrypt(email)
        const otp = generateOTP()
        const encryptedOtp = encrypt(otp);
        try {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'madhavagrawal842@gmail.com',
                    pass:  process.env.NODEMAILER_PASSWORD
                }
            });
            const link = `http://localhost:3000/otp/?data=${encryptedText.encryptedData}&iv=${encryptedText.iv}&data2=${encryptedOtp.encryptedData}&iv2=${encryptedOtp.iv}`
            var mailOptions = {
                from: 'madhavagrawal842@gmail.com',
                to: req.body.email,
                subject: 'Cryptex forgot passowrd link',
                text: link +` your Otp is ${otp} Also Do not Refesh Any page`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                return res.status(200).json({
                    success:true,
                    message:"Email sent to above the mentioned Id"
                })
            });
        } catch (error) {
            console.log(error);
        }

    }
})
module.exports = router