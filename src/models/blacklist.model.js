 const mongoose = require('mongoose');

 const tokenblacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required"],
        unique:[true,"token already exists"]
    },blacklistedAt:{
        type:Date,
        default:Date.now,
        immutable:true,
    }
},{
    timestamps:true
}) 

tokenblacklistSchema.index({blacklistedAt:1},{
    expireAfterSeconds:60*60*24*3//expire after 3 days
})

const tokenblacklistModel = mongoose.model("TokenBlacklist",tokenblacklistSchema);

module.exports = tokenblacklistModel;
