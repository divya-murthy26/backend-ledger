const express = require('express')
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

const router = express.Router()



/**
 * - POST /api/account
 * -Create a new account
 */
router.post("/",authMiddleware.authMiddleware,accountController.createAccount);

module.exports = router;