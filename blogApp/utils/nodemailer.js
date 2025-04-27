import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth:{
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS
    }
})


export const sendEmail = async (to, subject, text,html) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    html
  }

  await transporter.sendMail(mailOptions)
}

