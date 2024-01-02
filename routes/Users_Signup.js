const express = require('express');
const router = express.Router();
const fs = require('fs');
const Users = require('../models/user');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '10mb' });
const portfolio = require('../models/portfolio');
const { ObjectId } = require('mongodb');
const { imageset } = require('./image.js');

async function handlePostRequest(req, res, userData) {
    try {
        const resp = await savedata(userData);
        let status, message;

        if (resp) {
            status = 200;
            message = 'User Registered successfully';
        } else {
            status = 400;
            message = 'User Already exists';
        }

        res.status(status).json({
            success: resp,
            message: message,
        });
    } catch (error) {
        console.error('Error in handlePostRequest:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
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
            Image: imageset()
        });

        try {
            await userdata.save();
            const PortfolioData = new portfolio({
                id: new ObjectId(userdata._id.toString()),
                Balance: 10000,
                transaction: [],
                friendInvited: 0,
            });
            await PortfolioData.save();
            return true;
        } catch (error) {
            console.error('Error saving model:', error);
            return false;
        }
    }
}

router.post('/', jsonParser, async (req, res) => {
    const userData = req.body;
    await handlePostRequest(req, res, userData);
});

router.get('/', async (req, res) => {
    if (req.cookies.jwt) {
        res.redirect('/portfolio');
    }
    res.render('user_signup.ejs');
});

module.exports = router;
