const express = require('express');
const router = express.Router();
const fs = require('fs');
const { spawn } = require('child_process');
const Users = require('../models/user');
const verifytoken =  require ('../controllers/auth')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '10mb' });
const portfolio = require('../models/portfolio');
const { ObjectId } = require('mongodb');
// Create an async function to handle the post request
const {imageset} = require('./image.js')
async function handlePostRequest(req, res, userData) {
    try {
        const resp = await savedata(userData);
        if (resp) {
            return res.status(200).json({
                success: true,
                message: 'User Registered successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'User Already exists',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

async function savedata(userData) {
    const Userdata = await Users.findOne({ aadharNumber: userData.aadharNumber });
    if (Userdata) {
        return false;
    } else {
        const userdata = new Users({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phonenumber: userData.phno,
            dateofbirth: userData.dob,
            aadharNumber: userData.aadharNumber,
            Image:imageset()
        });
        
        try {
            await userdata.save();
            const PortfolioData = new portfolio({
                id:new ObjectId(userdata._id.toString()),
                Balance:10000,
                transaction:[],
                friendInvited:0,
            })
            await PortfolioData.save();
            return true;
        } catch (error) {
            console.error('Error saving model:', error);
            return false;
        }
    }
}

router.post('/', jsonParser,async (req, res) => {
    const userData = req.body;
    
    await handlePostRequest(req, res, userData);
});

router.get('/'  , async (req, res) => {
    if ( req.cookies.jwt)
    {
        res.redirect('/login')
    }
   
    res.render('user_signup.ejs')
});

module.exports = router;
