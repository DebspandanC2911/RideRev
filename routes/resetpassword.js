const express = require ('express')
const router = express.Router ()
const User = require ('../models/user')
const {encrypt,decrypt} = require('../controllers/security') 
router.get('/', async(req,res) => {
    res.render('reset.ejs');
})
router.post('/', async(req,res)=>{
    const finalemail = decrypt(req.query.data,req.query.iv)
    const email = finalemail;
    const UserData = await User.findOne({email:email});
    UserData.password = req.body.password;
    try {
        await UserData.save();
        return res.status(200).json({success:true,message:"Password Successfully Changed"})
    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false,message:"Password did not changed"})
    }
})
module.exports = router;