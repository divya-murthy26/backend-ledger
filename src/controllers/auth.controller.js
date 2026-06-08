const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenblacklistModel = require("../models/blacklist.model")
/**
*-User register controller
*-post api/auth/register
*/
async function userRegister(req, res) {
    const {email, password , name } = req.body

    const ifexists=await userModel.findOne({
        email:email
    })

    if(ifexists){
        return res.status(422).json({
            msg:"Email already exists",
            status:"failed"
        })
    }
    const user = await userModel.create({
        email,
        password,
        name
    })


    const token = jwt.sign(
    { userID: user._id },          // payload
    process.env.JWT_SECRET,        // secret key
    { expiresIn: "3d" }            // options
);
    res.cookie("token", token, {
    httpOnly: true
    })
    res.status(201).json({      
        user:{
            _id:user._id,
            email:user.email,
            name:user.name,
    
        },
        token:token
    })
    await emailService.sendRegistrationEmail(user.email, user.name);
}

/**
* - User login controller
* - post api/auth/login
*/
async function userLogin(req, res) {
    const {email, password } = req.body
    const user = await userModel.findOne({
        email:email
    }).select("+password") //password is returned in queries by default (security) so we need to select it
    if(!user){
        return res.status(401).json({
            msg:"Email does not exist",
            status:"failed"
        })
    }
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        return res.status(401).json({
            msg:"Password is not correct",
            status:"failed"
        })
    }
    const token = jwt.sign(
    { userID: user._id },          // payload
    process.env.JWT_SECRET,        // secret key
    { expiresIn: "3d" }            // options
);
    res.cookie("token", token, {
    httpOnly: true
    })
    res.status(200).json({      
        user:{
            _id:user._id,
            email:user.email,
            name:user.name,
    
        },
        token:token
    })
}

async function userLogout(req, res) {
  const token = req.cookies.token||req.headers.authorization.split(" ")[1];

  if(!token){
    return res.status(200).json({
        msg:"No token provided",
        status:"failed"
    })
  }

  
  await tokenblacklistModel.create({
    token:token
  })
  res.clearCookie("token", {
    httpOnly: true
  })

  res.status(200).json({
    msg:"Logout successful",
    status:"success"
  })
}

module.exports = {
    userRegister,
    userLogin,
    userLogout
}