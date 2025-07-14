require("dotenv").config(); 
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS, 
    },
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Error verifying transporter:", error);
    } else {
        console.log("✅ Server is ready to send emails");
    }
});

async function sendEmail() {
    try {
        const info = await transporter.sendMail({
            from: `"Your Company Name" <${process.env.GMAIL_USER}>`, 
            to: "precious27odumirin@gmail.com", 
            subject: "🎉 Welcome to Our Platform!", 
            text: "Thanks for joining us!", 
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">🎉 Welcome Aboard!</h2>
                    <p>We're thrilled to have you with us. Here's to a great experience ahead!</p>
                    <p>If you ever need support, just reply to this email — we’re here to help.</p>
                    <hr>
                    <p style="font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                </div>
            `
        });

        console.log(`✅ Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

sendEmail();