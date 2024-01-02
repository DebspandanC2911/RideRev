const express = require ('express')
const router = express.Router();
const transaction = require('../models/transactions')
const verifytoken = require ('../controllers/auth')
const mongoose = require ('mongoose')
const ObjectId = mongoose.Types.ObjectId
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}
router.get('/', verifytoken , async(req,res) => {
    const userId = req.user.id ;
    const transactionData = await transaction.find({id:new ObjectId(userId)}) ;
    for (const Data of transactionData) {
        Data.Timestamp = formatTimestamp(transactionData.Timestamp);
    }
    res.render('transactions.ejs',{data:transactionData})
})
module.exports = router ;