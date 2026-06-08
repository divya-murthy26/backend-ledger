const transactionModel = require("../models/transcation.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
/**
 * @description: creating a new transcation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
/**
 * the 10 step transfer flow
 * 1.validate request
 * 2.validate the idempotency key
 * 3.check account status
 * 4.derive sender balance from ledger
 * 5.Create transaction(pending)
 * 6.Create debit ledger entry
 * 7.Create credit ledger entry
 * 8.marks transcation completed
 * 9.commit mongoDB session
 * 10.send email notification
 *
 */

async function createTransaction(req, res) {
    // 1 . validate request


    const {fromAccount,toAccount,amount,idempotencyKey} = req.body;
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"fromAccount,toAccount,amount,idempotencyKey fields are required"
        })
    }
    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount
    })
    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })
    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"fromAccount or toAccount not found"
        })
    }
    // 2. validate the idempotency key

    const isTranscationAlreasyExist = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })
    if(isTranscationAlreasyExist){
        if(isTranscationAlreasyExist.status === "COMPLETED"){
            return res.status(200).json({
                message:"Transaction already completed",
                transactionId:isTranscationAlreasyExist._id
            })
        }
        if(isTranscationAlreasyExist.status === "PENDING"){
            return res.status(200).json({
                message:"Transaction already pending"
            })
        }
        if(isTranscationAlreasyExist.status === "FAILED"){
            return res.status(500).json({
                message:"Transaction is failed , Please try again"
            })
        }
        if(isTranscationAlreasyExist.status === "REVERSED"){
            return res.status(500).json({
                message:"Transaction is Reversed , Please try again"
            })
        }

    }
    // 3. check account status
    
    if(fromUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message:"From account is not active"
        })
    }
    if(toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message:"To account is not active"
        })
    }   

    // 4. derive sender balance from ledger
    const Balance = await fromUserAccount.getBalance();
    if(Balance < amount){
        return res.status(400).json({
            message:`From account balance is not enough , Current balance is ${Balance}, Required balance is ${amount}`
        })
    }
try{
    // 5. Create transaction(pending)

    const session = await mongoose.startSession();
    session.startTransaction();

   const transaction = (
    await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
    }], { session })
)[0];

    // 6. Create debit ledger entry
    await ledgerModel.create([{
        account:fromAccount,
        type:"DEBIT",
        amount:amount,
        transaction:transaction._id,
    }],{session});

    await (() =>{
        return new Promise((resolve)=>setTimeout(resolve,15*1000))
    })()

    // 7. Create credit ledger entry    
    await ledgerModel.create([{
        account:toAccount,
        type:"CREDIT",
        amount:amount,
        transaction:transaction._id,
    }],{session});

    // 8. marks transcation completed
   await transactionModel.findOneAndUpdate({
        _id:transaction._id
    },{
        status:"COMPLETED",
    },{session});

    // 9. commit mongoDB session
    await session.commitTransaction();
    session.endSession();
}catch(error){
    return res.status(400).json({
        message:"Transaction is pending , Please try again later"
    })
}
    
    return res.status(200).json({
        message:"Transaction created successfully",
        transactionId:transaction._id
    })

    //10. send email notification

    /*await emailService.sendEmailNotification(req.user.email , req.user.name,amount , transaction._id);
        */
        
}

async function createIntialFundsTranscation(req,res){
    const{toAccount,amount,idempotencyKey}=req.body;
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"toAccount,amount,idempotencyKey fields are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })
    
    if(!toUserAccount){
        return res.status(400).json({
            message:"toAccount not found"
        })
    
    }
    const fromUserAccount = await accountModel.findOne({
        user:req.user._id
    })
    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user not found"
        })
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount:fromUserAccount._id,
        toAccount,
        amount:amount,
        idempotencyKey:idempotencyKey,
        status:"PENDING",
    });

    const debitLedgerEntry = await ledgerModel.create([{
        account:fromUserAccount._id,
        amount,
        transaction:transaction._id,
        type:"DEBIT",
    }],{session});

    const creditLedgerEntry = await ledgerModel.create ([{
        account:toUserAccount._id,
        amount,
        transaction:transaction._id,
        type:"CREDIT",
        }],{session});

    transaction.status = "COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
        message:"Initial funds transaction created successfully",
        transactionId:transaction._id
    })

}
module.exports = {
    createTransaction,
    createIntialFundsTranscation,
}   
    