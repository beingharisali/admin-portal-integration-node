const userModel = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const register =async (req, res)=>{
    const {firstName, lastName, email, password} = req.body
    const existingUser = await userModel.findOne({email})
    if(existingUser){
        return res.status(400).json({
            success:false,
            msg:"Email already exists, please use another email"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({firstName, lastName, email, password: hashedPassword})
    const token = jwt.sign({
        email: user.email,
        id: user._id
    }, process.env.JWT_SECRET)
    res.status(201).json({
        success:true,
        msg:"User registered successfully",
        user,
        token
    })
}
const login =async (req, res)=>{
    const {email, password} = req.body
    const existingUser = await userModel.findOne({email})
    if (!existingUser) {
        return res.status(404).json({
            success:false,
            msg:"User don't exist"
        })
    }
    const matchedPassword = await bcrypt.compare(password, existingUser.password)
    if (!matchedPassword) {
        return res.status(400).json({
            success:false,
            msg:"Invalid Credentials"
        })
    }
    const token = jwt.sign({
        email:existingUser.email,
        id:existingUser._id
    }, process.env.JWT_SECRET)
    res.status(200).json({
        success:true,
        msg:"User logged in successfully",
        token
    })
}

module.exports = {register, login}