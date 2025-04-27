import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const protect = async(req,res, next)=>{
    let token;
    if(req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if(!token) {
        return res.status(401).json({message: "Not authorized, no token"})
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decode)
        const currentUser = await User.findById(decode.id).select("-password")
        if(!currentUser) {
            return res.status(401).json({message: "Not authorized, no user found"})
        }
        req.user = currentUser;
        next()
    } catch (error) {
        return res.status(401).json({message: "Not authorized, token failed"})
        
    }
}



export default protect