const express = require('express')
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

const router = express.Router()



/**
 * - POST /api/account
 * -Create a new account
 * -protected route
 */
router.post("/",authMiddleware.authMiddleware,accountController.createAccount);

/**
 * -GET /api/account
 * -fetch all the accounts
 * -protected route
 */
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountsController);

/**
 * -GET /api/account/balance/:accountId
 * -fetch the balance of the account
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController);

module.exports = router;