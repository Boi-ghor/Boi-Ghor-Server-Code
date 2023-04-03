const userModel = require("../models/User/User")
const jwt = require("jsonwebtoken")

exports.registerSignIn = async (req, res, next)=>{
    try{
        let decoded = jwt.verify(
            req.headers.authorization,
            process.env.jWT_SECRET
        );
        req.user = decoded;
        next()
    }catch(err){
        console.log(err)
        return res.status(401).json(err)
    }
}

exports.isAdmin = async (req, res, next)=>{
    try{
        const user = await userModel.findById(req.user._id)
        if(user.role === 0){
            return res.status(401).send("Unauthorized")
        }
        next()
    }catch(err){
        console.log(err)
    }
}