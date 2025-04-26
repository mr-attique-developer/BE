import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

import crypto from "crypto"
import { sendVerificationEmail } from "../utils/emailsender.js";

import jwt from "jsonwebtoken"


const generateToken = (userId) =>{
    return jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_KEY_EXPIRATION})
}

export const registerUser = async (req, res) => {

    try {
        
        const {name , email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            });
        }
        if(password.length < 6){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        
    const verificationToken = crypto.randomBytes(20).toString('hex');

        const newUser = await User.create({
            name, 
            email,
            password: hashPassword,
            verificationToken,
            verificationTokenExpiry: Date.now() + 30 * 60 * 1000, // 30 minutes
        })  

        await sendVerificationEmail(email,verificationToken)

        if(!sendVerificationEmail){
            return res.status(500).json({
                success: false,
                message: "Failed to send verification email",
            });
        }
        


        res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email to verify your account",
            user: newUser,
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "ERROR in register user controller",
            error: error.message,
        });
    }
}


export const verifyMail = async(req, res)=>{
    try {
        
        const {verifyToken }= req.params

        const user = await User.findOne({
            verificationToken:verifyToken
        })
        if(!user){
            return res.status(404).json({
                success: false,
                message: "Invalid or expired verification token",
            });
        }
       
        user.isverified = true
        user.verificationToken = undefined
        user.verificationTokenExpiry = undefined
        await user.save()
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });



    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "ERROR in verify mail controller",
            error: error.message,
        });
    }
}

export const loginUser = async (req,res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            });
        }
        const user  = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if(!user.isverified){
            return res.status(401).json({
                success: false,
                message: "Please verify your email before logging in",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken(user._id)

        res.cookie("token",token,{
            httpOnly: true,
            maxAge:  24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "ERROR in login user controller",
            error: error.message,
        });
        
    }
}



export const getUser = async (req,res)=>{
    try {

        const user = await User.findById(req.user.id).select("-password -verificationToken -verificationTokenExpiry")
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        });
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "ERROR in get user controller",
            error: error.message,
        });
        
    }
}



export const logoutUser = async (req, res) =>{
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now() ),
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "ERROR in logout user controller",
            error: error.message,
        });
    }
}
