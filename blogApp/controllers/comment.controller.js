import Blog from "../models/blog.model.js"
import Comment from "../models/comment.model.js"


export const createComment = async(req,res)=>{
    try {
        const {blogId} = req.params
        const {text} = req.body
        if(!text){
            return res.status(400).json({
                success: false,
                message: "Please enter your comment"
            })
        }
        const blog = await Blog.findById(blogId)
        if(!blog){
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            })
        }

        const comment = await Comment.create({
            user: req.user._id,
            blog: blogId,
            text
        })
        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in creating Comment"})
        
    }
}


export const getAllComments = async (req,res) =>{
    try {
        const {blogId} = req.params
        const comments = await Comment.find({blog: blogId}).populate("user", "name email")
        if(!comments){
            return res.status(404).json({
                success: false,
                message: "No Comments found"
            })
        }
        res.status(200).json({
            success: true,
            message: "All Comments Fetched successfully",
            count : comments.length,
            comments
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in getting Comments"})
        
    }
}



export const deleteComment = async (req,res) =>{
    try {
        const {commentId} = req.params
        const comment = await Comment.findById(commentId).populate("user", "name email")
        if(!comment){
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }
        if(comment.user._id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment"
            })
        }
        await comment.deleteOne()
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        })
    }
    
    catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in deleting Comment"})
        
    }
}   


export const updateComment = async (req,res) =>{
    try {
        const {commentId} = req.params
        const {text} = req.body

        const comment = await Comment.findById(commentId).populate("user", "name email")
        if(!comment){
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }
        if(comment.user._id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this comment"
            })
        }
        
        if(typeof  text === "string" && text.trim() === ""){
            return res.status(400).json({
                success: false,
                message: "Please enter your comment"
            })
        }
        if(text){
            comment.text = text
        }
        await comment.save()
        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in updating Comment"})
        
    }
}