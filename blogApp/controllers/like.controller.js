import Blog from "../models/blog.model.js"
import Like from "../models/like.model.js"


export const likeTheBlog = async (req,res) =>{
    try {
        const {blogId} = req.params
        const userId = req.user._id
        const blog = await Blog.findById(blogId)
    if(!blog){
        return res.status(404).json({
            success: false,
            message: "Blog not found"
        })
    }
    const liked = await Like.findOne({user: userId, blog: blogId})
    if(liked){
         await Like.deleteOne()
         res.status(200).json({
            success: true,
            message: "Blog Unliked successfully",

    })
}else{
    await Like.create({user: userId, blog: blogId})
    res.status(200).json({
        success: true,
        message: "Blog liked successfully",
    })
}

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in liking Blog"})
    }
}


export const getAllLikes = async (req,res) =>{
    try {
        const {blogId} = req.params
        const Likes = await Like.find({blog:blogId}).populate("user", "name email")
        if(!Likes){
            return res.status(404).json({
                success: false,
                message: "No Likes found"
            })
        }
        res.status(200).json({
            success: true,
            message: "All Likes Fetched successfully",
            count : Likes.length,
            Likes
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in getting Likes"})
        
    }
}