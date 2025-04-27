import express from "express"
import "dotenv/config.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./config/db.js"
import userRoutes from "./routes/user.routes.js"



const app = express()

app.use(cors())

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))


app.get("/", (req, res) => {
    res.send("Welcome to the Blog API")
})
// DB Conenction
connectDB()

// Routes
app.use("/api/v1/auth", userRoutes)

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log("Server is running on port", port)
})