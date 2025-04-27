import mongoose from "mongoose"


const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, " Please enter your Title "],
        lowercase: true,
    },
    description:{
        type:String,
        required:[true, " Please enter Description "],
        trim: true,
        lowercase: true,
    },
    coverImage:{
        type:String,
    },
    tags:{
        type:[String]

    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", 
        required:true
    }
}, {timestamps:true});
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;