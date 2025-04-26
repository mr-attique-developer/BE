import mongoose from 'mongoose';


const connectDB = async (req, res)=>{
    try {
       const conn =  await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    

        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "ERROR in connecting to DB",
            error: error.message,
        });
        
    }
}


export default connectDB