//server conflict here like middlewares and all api endpoints
const express = require("express")
const cookieParser = require("cookie-parser")

//routes
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transcationRouter = require("./routes/transcation.routes")


const app = express()
app.use(express.json())//req body to read the data
app.use(cookieParser())

//use of routes
app.use("/api/auth", authRouter)
app.use("/api/account", accountRouter)
app.use("/api/transactions", transcationRouter)

module.exports = app