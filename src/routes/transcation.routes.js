const {Router} = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transcationRoutes = Router();
const transactionController = require("../controllers/transcation.controller");



// post/api/transactions
//creating a  new transcation

transcationRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);

/**
 * -POST /api/transactions/system/initail-funds
 * -create initial funds for system user
 */

transcationRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createIntialFundsTranscation);

module.exports = transcationRoutes;