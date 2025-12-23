const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, "Please fill first name"],
        minLength:[3, "First name should be at least of 3 characters"],
        maxLength:[15, "First name cannot exceed 15 characters"]
    },
    lastName:{
        type:String,
        required:[true, "Please fill Last name"],
        minLength:[3, "Last name should be at least of 3 characters"],
        maxLength:[15, "Last name cannot exceed 15 characters"]
    },
    email:{
        type:String,
        required:[true, "Please fill email"],
        unique:[true, "Email already exist"]
    },
    password:{
        type:String,
        required:[true, "Please fill password field"],
        minLength:[8, "Password should be at least 8 characters"]
    }
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel