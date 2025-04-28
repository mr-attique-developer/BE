import express from 'express';
import protect from '../middlewares/user.middleware.js';
import { getAllLikes, likeTheBlog } from '../controllers/like.controller.js';

const router = express.Router();

router.route("/:blogId").put(protect,likeTheBlog)
router.route("/:blogId").get(protect,getAllLikes)

export default router;