const express = require ('express')
const router = express.Router()
const multer=require('multer')
const mongodb=require('mongodb')
const fs=require('fs')
const path=require('path')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const User = require('../models/user')
const verifytoken = require('../controllers/auth')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
router.get('/', async(req,res)=>{
    res.send("Hello world")
})
router.post('/', [verifytoken,upload.single('image')] , async(req,res)=>{
    const UserData = await User.findOne({_id:new ObjectId(req.user.id)});
    if ( req.body.name )
    {
        UserData.name = req.body.name;
    }
    if ( req.body.phnum )
    {
        UserData.phonenumber = req.body.phnum
    }
    if ( req.body.dob )
    {
        UserData.dateofbirth = req.body.dob ;
    }
    if (req.file)
    {
        UserData.Image = req.file.buffer.toString('base64')
    }
    try{
        await UserData.save() ;
        return res.status(200).json({success:true,message:"Updated successfully"})
    } catch(error)
    {
        console.log(error)
        return res.status(400).json({success:false,message:"Error Occured"});
    }
    
})

module.exports = router;