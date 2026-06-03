const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Transaction must have a from account"],
        index:true, 
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Transaction must have a to account"],
        index:true, 
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Transaction status must be pending, completed, failed or reversed"
           
        },
         default:"COMPLETED",
    },
        amount:{
        type:Number,
        required:[true,"Transaction must have an amount"],
    },
    idempotencyKey:{
        type:String,
        required:[true,"Transaction must have an idempotency key"],
        index:true, 
        unique:true,
    },
},
    {
        timestamps:true
    

})


const transactionModel = mongoose.model("Transaction",transactionSchema);

module.exports = transactionModel;
