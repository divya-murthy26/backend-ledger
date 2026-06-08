const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenblacklistModel = require("../models/blacklist.model");


//token checking be4 account creation
async function authMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            msg:"No token provided",
            status:"failed"
        })
    }
    const blacklistedToken = await tokenblacklistModel.findOne({
        token:token
    })
    if(blacklistedToken){
        return res.status(401).json({
            msg:"Token is blacklisted",
            status:"failed"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.userID);
        req.user = user;
        console.log(req.user);
       return next()

    }catch(err){
        return res.status(401).json({
            msg:"Invalid token",
            status:"failed"
        })
    }
}

async function authSystemUserMiddleware(req,res,next){ 
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            msg:"No token provided",
            status:"failed"
        })
    }
    const blacklistedToken = await tokenblacklistModel.findOne({
        token:token
    })
    if(blacklistedToken){
        return res.status(401).json({
            msg:"Token is blacklisted",
            status:"failed"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userID).select("+SystemUser");
        if(!user || !user.SystemUser){
            return res.status(403).json({   
                msg:"User is not a system user",
                status:"failed"
            })
        }
        req.user = user;
        console.log("User:", user);
        console.log("SystemUser:", user.systemUser);
        return next()
    }catch(err){
        return res.status(401).json({
            msg:"Invalid token",
            status:"failed"
        })
    }
}
        


module.exports={
    authMiddleware,
    authSystemUserMiddleware
}