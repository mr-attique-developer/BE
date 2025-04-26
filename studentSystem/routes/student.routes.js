import express from "express"
import { createStudent, delStudent, getAllStudents, updateStudent } from "../controllers/student.controller.js"

const router = express.Router()


router.route("/getAllStudents").get(getAllStudents)
router.route("/createStudent").post(createStudent)
router.route("/delStudent/:id").delete(delStudent)
router.route("/updateStudent/:id").put(updateStudent)


export default router