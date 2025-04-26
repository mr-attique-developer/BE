import express from "express"
import { getUser, loginUser, logoutUser, registerUser, verifyMail } from "../controllers/user.controller.js"
import { protect } from "../middleware/user.middleware.js"

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(protect, logoutUser)
router.route("/getMe").get(protect,getUser)
router.route("/verify-email/:verifyToken").get(verifyMail)

export default router