//routes for register and login

const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")

/*Post method/api/auth/register*/
router.post("/register", authController.userRegister)

/*Post method/api/auth/login*/
router.post("/login", authController.userLogin)

/*

*Post method/api/auth/logout*/
router.post("/logout", authController.userLogout);

module.exports = router