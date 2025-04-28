import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blog:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:{
        type: String,
        required: [true, "Please enter your comment"],
    }
}, {timestamps: true})

const Comment = mongoose.model("Comment", commentSchema)

export default Comment