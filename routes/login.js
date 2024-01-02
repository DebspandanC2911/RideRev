const express = require('express');
const router = express.Router();
const users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const verifytoken = require ('../controllers/auth');
router.post('/', async (req, res,next) => {
    const loginData = req.body;
    try {
        const UserData = await users.findOne({ email: loginData.username });
        
        if (!UserData) {
            res.status(401).json({
                success: false,
                message: "User is not registered with us"
            });
        } else {
            const checkpassword = await bcrypt.compare(loginData.password, UserData.password);

            if (!checkpassword) {
                res.status(401).json({
                    success: false,
                    message: "Wrong password"
                });
            } else {
                const userinfo = {
                    id : UserData._id ,
                }
                const token = jwt.sign(userinfo, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
                res.cookie('jwt', token, { httpOnly: true });
                res.status(200).json({
                    success: true,
                    message: "User logged in successfully",
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

router.get('/' ,async (req, res) => {
    if ( req.cookies.jwt)
    {
        res.redirect('/portfolio')
    }
    else
    res.render('user_login.ejs');
});

module.exports = router;
