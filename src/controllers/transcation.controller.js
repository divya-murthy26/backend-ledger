const transactionModel = require("../models/transcation.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");
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
    const {fromAccount,toAccount,amount,idempotencyKey} = req.body;
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"fromAccount,toAccount,amount,idempotencyKey fields are required"
        })
    }
}
