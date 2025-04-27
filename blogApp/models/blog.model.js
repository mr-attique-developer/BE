import mongoose from "mongoose"


const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, " Please enter your Title "],
        lowercase: true,
    },
    content:{
        type:String,
        required:[true, " Please enter content "],
        trim: true,
        lowercase: true,
    },
    coverImage: {
        public_id: { type: String },
        url: { type: String },
    },
    category:{
        type:String,
        required:[true, " Please enter Category "],
        lowercase: true,
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