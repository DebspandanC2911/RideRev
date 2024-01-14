const express = require ('express')
const router = express.Router();
router.get('/', async(req,res)=>{
    res.clearCookie('jwt');
    res.redirect('/');
})
module.exports=router