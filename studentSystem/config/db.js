import mongoose from "mongoose";


const MONGO_CONNECTION = async()=>{
    try {
        const con =  await mongoose.connect(process.env.MONGO_URI)
        console.log(`MONGO DB CONNECTED SUCCESSFULLY AT ${con.connection.host}`)
    } catch (error) {
        console.log(error.message)
        console.log("ERROR IN MONGODB CONNECTION")
    }
}

export default MONGO_CONNECTION