import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Created function to send email
const sendEmail = async ({to, subject, body}) => {
    const response = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html: body,
    })

    return response;
}

export default sendEmail;