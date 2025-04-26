import express from "express"
import cors from "cors"
import "dotenv/config"
import MONGO_CONNECTION from "./config/db.js"
import studenRouter from "./routes/student.routes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())



// connection mongodb

MONGO_CONNECTION()




//  router 

app.use("/api/v1",studenRouter)

const PORT = process.env.PORT || 8009
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})