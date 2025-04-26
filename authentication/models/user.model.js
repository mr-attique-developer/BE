import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Name is required"],
    },
    email:{
        type:String,
        required: [true, "Email is required"],
        unique: true
    },
    password:{
        type:String,
        required: [true, "Password is required"],
        minLength:[6, "Password must be at least 6 characters"],
    },
    role:{
        type:String,
        enum:["admin", "user"],
        default: "user"
    },
    isverified:{
        type:Boolean,
        default: false
    },
    verificationToken:{
        type:String,
        default: ""
    },
    verificationTokenExpiry:{
        type:Date,
        default: Date.now()
    },
},{timestamps:true})
const User = mongoose.model("User", userSchema)
export default User