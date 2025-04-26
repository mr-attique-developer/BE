
import nodemailer from "nodemailer";

import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendVerificationEmail = async(email, verificationToken) =>{
    try {
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to:email,
            subject: "Verify your email",
            text: `Click on the link to verify your email: http://localhost:8000/api/v1/user/verify-email/${verificationToken}`,
             html: `<p>Please verify your email by clicking: 
             <a href="http://localhost:8000/api/v1/user/verify-email/${verificationToken}">Verify Email</a></p>`
        }
        
        await transporter.sendMail(mailOptions)
        // console.log(`Email sent to ${email}`)
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
      }
    
}