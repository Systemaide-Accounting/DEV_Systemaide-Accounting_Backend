import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure the email transporter using environment variables
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
	port: process.env.EMAIL_PORT, // e.g., 587 or 465
	secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER, // Your email address
		pass: process.env.EMAIL_PASS, // Your email password or app password
	},
});

/**
 * Sends a password reset email.
 * @param {string} to - Recipient email address.
 * @param {string} code - The 6-digit reset code.
 */
const sendPasswordResetEmail = async (to, code) => {
	const mailOptions = {
		from: `"Systemaide Accounting" <${process.env.EMAIL_USER}>`, // sender address
		to: to, // list of receivers
		subject: "Your Password Reset Code", // Subject line
		text: `Your password reset code is: ${code}\nThis code will expire in 10 minutes.`, // plain text body
		html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; background-color: #f9f9f9;">
                <h2 style="color: #2c3e50; text-align: center;">🔐 Password Reset Request</h2>
                <p style="font-size: 16px; color: #333;">
                Hello,
                </p>
                <p style="font-size: 16px; color: #333;">
                We received a request to reset your password. Please use the verification code below to complete the process.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; font-size: 32px; color: #fff; background-color: #3498db; padding: 12px 24px; border-radius: 6px; letter-spacing: 3px;">
                    ${code}
                </span>
                </div>
                <p style="font-size: 16px; color: #333;">
                This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email or contact support.
                </p>
                <p style="font-size: 16px; color: #333;">
                Thanks,<br/>
                <strong>The Systemaide Accounting Team</strong>
                </p>
            </div>
            `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log(`Password reset email sent to ${to}`);
	} catch (error) {
		console.error(`Error sending password reset email to ${to}:`, error);
		// Rethrow or handle error as needed, maybe log it more formally
		// Avoid exposing detailed errors to the client
		throw new Error("Failed to send password reset email.");
	}
};

export { sendPasswordResetEmail };
