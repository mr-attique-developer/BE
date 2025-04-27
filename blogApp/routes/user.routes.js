import express from "express"
import { forgotPassword, getUser, loginUser, logoutUser, registerUser, resetPassword, verifyMail } from "../controllers/user.controller.js"
import protect from "../middlewares/user.middleware.js"

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/verify-email/:verifyToken").get(verifyMail)
router.route("/login").post(loginUser)
router.route("/getMe").get(protect, getUser)
router.route("/logout").get(protect, logoutUser)
router.route("/forgot-password").post(protect, forgotPassword)
router.route("/reset-password/:resetToken").post(protect, resetPassword)


export default router