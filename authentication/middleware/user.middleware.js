


import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protect = async(req, res, next) => {
    let token;
    if(req.cookies.token){
        token = req.cookies.token
    }
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Token Not Found",
        });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const currentUser = await User.findById(decode.userId).select("-password")
        console.log(decode)
        if(!currentUser){
            return res.status(401).json({
                success: false,
                message: "Not authorized User ",
            });
        }

        req.user = currentUser

        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
        
    }

}