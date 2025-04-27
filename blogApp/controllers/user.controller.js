import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendEmail } from "../utils/nodemailer.js"


export const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES_IN || "30d"
    })
}


export const registerUser = async (req,res)=>{
    try {
        const {name, email, password} = req.body
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Please enter all fields"
        })
    }
    const exixtingUser = await User.findOne({email})
    if(exixtingUser){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
    }
    if(password.length < 6){
        return res.status(400).json({
            success:false,
            message:"Password must be at least 6 characters"
        })
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

    // send verification email to user with token
    const verificationUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${verificationToken}`
    const subject = "Email Verification"
    const emailBody = `<p>Click the link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a></p>`
    sendEmail(email, subject, "Verify your email", emailBody)
    const user = await User.create({
        name,
        email,
        password: hashPassword,
        verificationToken
    })
    const token = generateToken(user._id)
    res.status(201).json({
        success:true,
        message: "User registered successfully Please verify your email",
        token,
        user
    })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message:"Error in register User controller",
        })
        
    }
}


export const verifyMail = async( req, res) =>{
    try {
        const {verifyToken} = req.params
        const user = await User.findOne({verificationToken: verifyToken})
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            })
        }
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpire = undefined

        await user.save()

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message:"Error in verify Mail controller",
        }) 
    }
}

export const loginUser = async (req, res) =>{
    try {
        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            })
        }
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            })
        }
        const token = generateToken(user._id)
        if(!user.isVerified){
            return res.status(401).json({
                success: false,
                message: "Please verify your email before logging in",
            })  
            
        }

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            sameSite: "none",
            secure: true,
        })
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message:"Error in login User controller",
        })
        
    }
}


export const getUser = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password")
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "User get successfully",
            user,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message:"Error in get User controller",
        })
        
    }
}


export const logoutUser = async (req,res) =>{
    try {
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(Date.now()),
            sameSite: "none",
            secure: true,
        })
        res.status(200).json({
            success: true,
            message: "Logout successful",
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message:"Error in logout User controller",
        })
        
    }
}


export const forgotPassword = async(req,res) =>{
    try {
        const {email} = req.body
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Please provide email",
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        const resetToken = await crypto.randomBytes(32).toString("hex")
        const resetTokenExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
       user.resetPasswordToken = resetToken
       user.resetPasswordExpire = resetTokenExpire
         await user.save()

        // send reset password email to user with token
        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`
        const subject = "Reset Password"
        const emailBody = `<p>Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
        sendEmail(email, subject, "Reset your password", emailBody)
        res.status(200).json({
            success: true,
            message: "Reset password email sent successfully",
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message:"Error in forgot password controller",
        })
        
    }
}


export const resetPassword = async(req,res) =>{
    try {
        const {password} = req.body
        const {resetToken} = req.params
        // console.log(resetToken)
        // console.log(password)

        if(!password || password.length < 6){
            return res.status(400).json({
                success: false,
                message: "Please provide password and password must be at least 6 characters",
            })
        }
        const user = await User.findOne({
            resetPasswordToken:resetToken,
            resetPasswordExpire: { $gt: Date.now() }

        })
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
      
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        user.password = hashPassword
        user.resetToken = undefined
        user.resetTokenExpire = undefined
        await user.save()
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message:"Error in reset password controller",
        })
        
    }
}