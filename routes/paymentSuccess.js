const express = require ('express')
const router = express.Router();
const verifytoken = require('../controllers/auth')
const portfolio = require ('../models/portfolio')
const transaction = require ('../models/transactions')
const {encrypt,decrypt} = require('../controllers/security')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
router.get('/', verifytoken ,async(req,res) => {
    const money = Number(decrypt(req.query.data,req.query.iv))
    const newTransaction = new transaction({
        id:new ObjectId (req.user.id) ,
        type:'Add Balance' ,
        Timestamp:Date.now() ,
        coinId : 'None' ,
        status : true ,
        Amount : money
    })

    const id = req.user.id ;
    const portfolioData = await portfolio.findOne({id:new ObjectId(id)});
    portfolioData.Balance += money;
    try
    {   await newTransaction.save();
        await portfolioData.save();
        res.redirect('/portfolio');
    } 
    catch (error)
    {
        console.log('error recieved :' + error ) ;
    }
})
module.exports=router;