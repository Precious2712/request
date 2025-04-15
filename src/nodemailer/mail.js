require("dotenv").config(); // Load .env variables
const nodemailer = require("nodemailer");

// Create a transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER, // Use environment variable
        pass: process.env.GMAIL_PASS, // Use App Password if 2FA is enabled
    },
});

// Verify transporter connection
transporter.verify((error) => {
    if (error) {
        console.error("❌ Error verifying transporter:", error);
    } else {
        console.log("✅ Server is ready to send emails");
    }
});

// Function to send an email
async function sendEmail() {
    try {
        const info = await transporter.sendMail({
            from: `"Your Name" <${process.env.GMAIL_USER}>`, // Set your actual email
            to: "recipient@example.com", // List of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // Plain text body
            html: `
             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Welcome to Our Platform!</h2>
                <p>Thank you for starting the signup process. Please click the button below to complete your registration:</p>
                
                <a href="${signupLink}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                          color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                    Complete Signup
                </a>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${signupLink}</p>
                
                <p>If you didn't request this signup, please ignore this email.</p>
                <hr>
                <p style="font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </div>
            `
        });

        console.log(`✅ Message sent: ${info.messageId}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

// Call the function to send an email
sendEmail();
