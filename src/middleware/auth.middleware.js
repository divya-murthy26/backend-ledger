const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

//token checking be4 account creation
async function authMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            msg:"No token provided",
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

module.exports={
    authMiddleware
}