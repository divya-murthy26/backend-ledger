const mongoose = require("mongoose")
const bcrypt = require("bcryptjs") // not bycrypt


const UserSchema = new mongoose.Schema({
   
    email:{
        type:String,
        required:[true,"Please enter email"],
        trim:true,
        unique:[true,"Email already exists"],
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please enter valid email"] //regex for email validation

    },
    name:{
        type:String,
        required:[true,"Please enter name"],
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:[6,"Password must be at least 6 characters"],
        select:false//password NOT returned in queries by default (security)
    },
},
    {
        timestamps:true
    })
    //donot use next function because it is a middleware function ans we want to stop the execution of the middleware
   UserSchema.pre("save", async function() {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

    UserSchema.methods.comparePassword = async function(candidatePassword){
        return await bcrypt.compare(candidatePassword,this.password)
    }

module.exports = mongoose.model("User",UserSchema)