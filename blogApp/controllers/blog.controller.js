import { cloudinary } from "../config/cloudinaryConfig.js"
import Blog from "../models/blog.model.js"



export const createBlog  = async(req, res) => {
    try {
        const {title, content, tags, category} = req.body
        if(!title || !content || !tags || !category){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }
        console.log(title, content, tags, category)
        const author = req.user._id
        let coverImage = ""
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path)
            coverImage ={
                public_id: result.public_id,
                url: result.secure_url
            }
        }

        const blog = await Blog.create({
            title,
            content,
            tags,
            category,
            coverImage,
            author
        })
        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog
        })  
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in creating Blog"})
        
    }
}


export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "name email")
        if(!blogs){
            return res.status(404).json({
                success: false,
                message: "No Blogs found"
            })
        }
        res.status(200).json({
            success: true,
            message: "All Blogs Fetched successfully",
            
            count : blogs.length,
            blogs
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in getting Blogs"})
    }
}


export const getSingleBlog = async (req,res) =>{
    try {
        const blog = await Blog.findById(req.params.id).populate("author", "name email")
        if(!blog){
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Single Blog Fetched successfully",
            blog,

        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in getting Blog"})
    }
}



export const updateBlog  = async (req,res) =>{
    try {
        let blog = await Blog.findById(req.params.id).populate("author", "name email")
        if(!blog){
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            })
        }
        if(blog.author._id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog"
            })
        }
       
if(req.file){
    if(blog.coverImage.public_id){
        await cloudinary.uploader.destroy(blog.coverImage.public_id)

    }
    const result = await cloudinary.uploader.upload(req.file.path)
req.body.coverImage  = {
    
            public_id: result.public_id,
            url: result.secure_url
        }
}
blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
})

res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog
    

})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in updating Blog"})
        
    }
}


export const deleteBlog = async (req,res) =>{
    try {
        const blog = await Blog.findById(req.params.id).populate("author", "name email")
        if(!blog){
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            })
        }
        if(blog.author._id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog"
            })
        }
        if(blog.coverImage.public_id){
            await cloudinary.uploader.destroy(blog.coverImage.public_id)
        }

        await Blog.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Error in deleting Blog"})
    } 
}