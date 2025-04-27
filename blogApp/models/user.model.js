import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, " Please enter your Name "],
        lowercase: true,
    },
    email:{
        type:String,
        required:[true, " Please enter email "],
        unique:true,
        trim: true,
        lowercase: true,

    },
    password:{
        type:String,
        required:[true, " Please enter your Name "]
    },
    isVerified:{
        type:Boolean,
        default:false

    },
    verificationToken:{
        type:String,
    },
    verificationTokenExpire:{
        type:Date,
        default:Date.now
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default:"user"
    },
    profilePic:{
        type:String,
        default:""
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordExpire:{
        type:Date
    },
}, {timestamps:true});


const User = mongoose.model("User", userSchema);

export default User;