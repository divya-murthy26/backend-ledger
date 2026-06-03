const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Account must belong to a user"],
        index:true,

    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Account status must be active, frozen or closed"
           
        },
         default:"ACTIVE",
    },
    currency:{
        type:String,
        required:[true,"Account must have a currency"],
        default:"INR",
    }
},
    {
        timestamps:true
    
})

accountSchema.index({user:1,status:1})//compound index



const accountModel = mongoose.model("Account",accountSchema);

console.log(accountModel);

module.exports = accountModel;
