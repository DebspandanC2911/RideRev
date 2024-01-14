const express = require('express');
const router = express.Router()
const User = require ('../models/user')
const jwt = require('jsonwebtoken')
router.get('/', async(req,res) => {
    const email = decodeURIComponent(req.query.email)
    const UserData = await User.findOne({email: email})
    if (UserData)
    {
        const userinfo = {
            id : UserData._id.toString() ,
        }
        const token = jwt.sign(userinfo, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
        res.cookie('jwt', token, { httpOnly: true });
        res.redirect('/portfolio')
    }
    else
    {
        res.redirect('/sign_up/?account=false')
    }
    
})

module.exports=router;