const express = require ('express')
const router = express.Router()
const verifytoken = require('../controllers/auth')
const User = require('../models/user')
const mongoose = require ('mongoose')
const ObjectId = mongoose.Types.ObjectId
router.get('/', verifytoken ,async(req,res) => {
    const UserData = await User.findOne({_id:new ObjectId(req.user.id)})
    res.render('userProfile.ejs',{data:UserData})
})
module.exports=router