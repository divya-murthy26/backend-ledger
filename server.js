//server start here
require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")

connectDB()



app.listen(3000 ,()=>{
    console.log("server is started at port 3000") ;  
});