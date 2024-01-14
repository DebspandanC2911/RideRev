const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const verifytoken = require('../controllers/auth');
const Portfolio = require('../models/portfolio');
const transaction = require('../models/transactions');
const User = require ('../models/user')
const axios = require('axios');

router.get('/', verifytoken, async (req, res) => {
    try {
        const userId = req.user.id;
        const nooftransactions = await transaction.find({ id: new ObjectId(userId) });
        const PortfolioData = await Portfolio.findOne({ id: new ObjectId(userId) });
        const uniqueCoinIds = PortfolioData.priceholdings.map(transaction => transaction.coinId);
        const coinImages = await Promise.all(uniqueCoinIds.map(async (coinId) => {
            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);

                if (response.data && response.data.image && response.data.image.small) {
                    return response.data.image.small;
                } else {
                    return null;
                }
            } catch (error) {
                console.error(`Error fetching image for coinId ${coinId}:`, error.message);
                return null;
            }
        }));
        const userImage = await User.findOne({_id:new ObjectId(req.user.id)});
        res.render('portfolio.ejs', { status: "2", data: PortfolioData, trans: nooftransactions.length, coinImages ,image:userImage.Image});
    } catch (error) {
        console.error('Error in portfolio route:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
