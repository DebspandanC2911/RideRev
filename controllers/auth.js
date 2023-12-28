const jwt = require ('jsonwebtoken')
function verifytoken ( req,res,next)
{
    const token = req.cookies.jwt ;
    if (!token)
    {   
        return res.redirect('/login');
    }
    else
    {
        jwt.verify(token,process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
            req.user = decoded;
            next();
        });
    }
    
}
module.exports= verifytoken ;