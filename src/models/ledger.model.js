const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Ledger must belong to an account"],
        index:true,
        immutable:true

    },
    amount:{
        type:Number,
        required:[true,"Ledger must have an amount"],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transaction",
        required:[true,"Ledger must belong to a transaction"],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Ledger type must be credit or debit"
           
        },
        required:[true,"Ledger must have a type"],
        immutable:true
    }
},
    {
        timestamps:true
    
})

function preventLedgerModification(){
    throw new Error("Ledger modification is not allowed");
}

ledgerSchema.pre("findOneAndUpdate ",preventLedgerModification);
ledgerSchema.pre("updateOne ",preventLedgerModification);
ledgerSchema.pre("deleteOne ",preventLedgerModification); 
ledgerSchema.pre("remove",preventLedgerModification); 
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);

        
const ledgerModel = mongoose.model("Ledger",ledgerSchema);

module.exports = ledgerModel;