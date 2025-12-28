const userModel = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
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

const sendResetPasswordEmail = async (email, resetToken)=>{
    try {
        const transporter = nodemailer.createTransport({
                service:'gmail',
                port:587,
                secure:false,
                auth:{
                    user:process.env.SMTP_EMAIL,
                    pass:process.env.SMTP_PASSWORD
                }
            })
            const resetLink = `http://localhost:5173/reset-password/${resetToken}`
            const mailOptions = {
                from:process.env.SMTP_EMAIL,
                to: email,
                subject:"Forget Password Email",
                html:`Please click on this link to reset your password <a href=${resetLink}>${resetLink}</a>`
            }
            await transporter.sendMail(mailOptions)
            console.log(`Reset Password Link sent to ${email}`)
        
    } catch (error) {
        console.log('error',error)
    }
}

const forgetPassword = async(req, res)=>{
    try {
        const {email} = req.body
        const existingUser = await userModel.findOne({email})
    if (!existingUser) {
        return res.status(404).json({
            success:false,
            msg:"Email don't exist"
        })
    }
    const resetToken = jwt.sign({
        email:existingUser.email,
        id:existingUser._id
    }, process.env.JWT_SECRET, {expiresIn:'1h'})
    existingUser.resetPasswordToken = resetToken
    existingUser.resetPasswordTokenExpiry = Date.now() + 3600000

    await sendResetPasswordEmail(email, resetToken)
        res.status(200).json({
            success:true,
            msg:"Email sent successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            msg:'Internal Server Error',
            error
        })
    }
}
const resetPassword = async(req, res)=>{
    const {password} = req.body;
    const {token} = req.params;
    console.log('token', token)
    try {
        const user = await userModel.findOne({resetPasswordToken:token, resetPasswordTokenExpiry:{$gt:Date.now()}})
        if (!user) {
            return res.status(400).json({
                success:false,
                msg:"Invalid or expired Token"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetPasswordToken = null
        user.resetPasswordTokenExpiry = null

        const resetEmail = user.email
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: resetEmail,
            subject: `<h1>Reset Password Success</h1>`,
            html:`<p>Your password has been reset successfully. Please login with new password</p>`
        }
        const transporter = nodemailer.createTransport({
            service:'gmail',
                port:587,
                secure:false,
                auth:{
                    user:process.env.SMTP_EMAIL,
                    pass:process.env.SMTP_PASSWORD
                }
        })
        await transporter.sendMail(mailOptions)
        console.log('reset token', token)
        console.log('Password reset email sent successfully')
        res.status(200).json({
            success:true,
            msg:"Password reset successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            msg:"Internal Server Error",
            error
        })
    }
}

module.exports = {register, login, forgetPassword, resetPassword}