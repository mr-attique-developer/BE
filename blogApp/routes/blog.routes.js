import express from 'express';
import { createBlog, deleteBlog, getAllBlogs, getSingleBlog, updateBlog } from '../controllers/blog.controller.js';
import protect from '../middlewares/user.middleware.js';
import upload from '../config/cloudinaryConfig.js';


const router = express.Router();

router.route("/create-blog").post(protect, upload.single("file"), createBlog)
router.route("/all").get(protect, getAllBlogs)
router.route("/get/:id").get(protect, getSingleBlog)
router.route("/delete/:id").delete(protect, deleteBlog)
router.route("/update-blog/:id").put(protect,upload.single("file"), updateBlog)

export default router;