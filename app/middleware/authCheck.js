const jwt = require('jsonwebtoken')
const User = require('../model/user.model')
const AuthCheck = async (req,res,next)=>{
    try {
        const token = req.headers['authorization'] || req.cookies.authorization;
        if(!token){
            return res.status(400).json({
                status:false,
                message:'Unauthorised: No token provided'
            })
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET)
        console.log(decode)

        req.user = await User.findById(decode._id).select('-password') ;
        if(!req.user)return res.status(404).json({message:'User not found...'})
        next();
    } catch (error) {
         console.log(error)
        res.status(401).json({
            status:false,
            message:'Invalid or expired token'
        })
    }
}

module.exports = AuthCheck