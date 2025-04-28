import express from 'express';
import protect from '../middlewares/user.middleware.js';
import { createComment, deleteComment, getAllComments, updateComment } from '../controllers/comment.controller.js';


const router = express.Router();
router.route("/:blogId").post(protect,createComment)
router.route("/:blogId").get(protect,getAllComments)
router.route("/:commentId").delete(protect,deleteComment)
router.route("/:commentId").put(protect,updateComment)


export default router;