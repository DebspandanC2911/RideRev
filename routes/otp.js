const express = require ('express')
const router = express.Router()
const {encrypt,decrypt} = require('../controllers/security')
router.get('/', async(req,res)=> {
    res.render('otp.ejs');
    
})
router.post('/', async(req,res)=>{
    const email = decrypt(req.query.data,req.query.iv);
    const otp = Number(decrypt(req.query.data2,req.query.iv2));
    const otpentered = Number(req.body.otp);
    if ( otp == otpentered)
    {
        const newencryptedEmail = encrypt(email);
        return res.status(200).json({
            success:true,
            data:newencryptedEmail.encryptedData,
            iv:newencryptedEmail.iv
        })
    }
    else{
        return res.status(402).json({
            success:false, 
            message:"Please Enter the correct otp"
        })
    }
})
module.exports=router;