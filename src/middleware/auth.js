const userModel = require("../models/User/User")
const jwt = require("jsonwebtoken")

exports.registerSignIn = async (req, res, next)=>{
    try{
        let decoded = jwt.verify(
            req.headers.authorization,
            "sohanur653"
        );
        console.log(decoded)
        req.user = decoded;
        console.log(req.user)
        next()
    }catch(err){
        console.log(err)
        return res.status(401).json(err)
    }
}

exports.isAdmin = async (req, res, next)=>{
    try{
   const id=(req.user._id)
        const user= await userModel.findById(id)
        console.log(user)
        if(user.role === 0){
            return res.status(401).json("Unauthorized")
        }
        next()
    }catch(err){
        console.log(err)
    }
}