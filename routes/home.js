const express = require('express')
const router = express.Router()
const axios = require('axios')
const UserPortfolio = require('../models/portfolio')
const verifytoken = require('../controllers/auth')
const mongoose = require('mongoose')
const objectId = mongoose.Types.ObjectId;
router.get('/', async (req, res) => {
    const {imageset} = require('./image.js')
    try {
        res.render('home.ejs', { user: req.cookies.jwt });

    } catch (error) {
        console.log(`error occured ${error}`)
        res.status(400).json({
            success: false,
            message: "error occured in fetchong data"
        })
    }

})
router.put('/', verifytoken, async (req, res) => {
    const id = req.user.id;
    const coinName = req.body.name;
    
    try {
        const result = await UserPortfolio.findOne(
            { id: new objectId(id) }
        );
        const coinNames = {
            coinId:coinName
        }
        const coinExists = result.Watchlist.some(item => item.coinId === coinName);
        if (!coinExists)
        {
            result.Watchlist.push(coinNames);
            await result.save();
        }
    } catch (error) {
        console.error('Error updating user watchlist:', error);
    }
})
module.exports = router