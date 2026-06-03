const mongoose = require("mongoose")
require("dotenv").config()

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("mongodb connected");
        console.log("DB Name:", mongoose.connection.name);
    }).catch((err)=>{
        console.log(err)
        process.exit(1)//server ends here if any error there bcz if server isnt able to connect to db tn it connect work
    })

}

module.exports = connectDB;