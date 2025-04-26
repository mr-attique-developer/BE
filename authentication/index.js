import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/db.js"
import userRoutes  from "./routes/user.routes.js"
import cookieParser from "cookie-parser"


const app = express()


app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.get("/api/v1", (req, res) => {
    res.send("API is working")
})



// mognodb connection

connectDB()

// routes
app.use("/api/v1/user", userRoutes)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})  
