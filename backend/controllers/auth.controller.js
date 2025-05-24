import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Import crypto for token generation

import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { sendPasswordResetEmail } from "../helpers/email.js"; // Import email helper

export const signIn = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			const errors = {};
			if (!email) errors.email = "Email is required";
			if (!password) errors.password = "Password is required";
			return res.status(400).json({
				success: false,
				message: "Validation Error",
				errors,
			});
		}

		const existingUser = await User.findOne({
			email: email,
		});

		if (!existingUser) {
			return res.status(400).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Check if account is already blocked
		if (existingUser.status === "blocked") {
			return res.status(403).json({
				success: false,
				message: "Account is blocked. Please contact support.",
			});
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isPasswordCorrect) {
			existingUser.failedLoginAttempts += 1;

			if (existingUser.failedLoginAttempts >= 5) {
				existingUser.status = "blocked";
				existingUser.blockedAt = new Date();
				await existingUser.save();
				return res.status(403).json({
					success: false,
					message: "Account blocked due to too many failed login attempts.",
				});
			}

			await existingUser.save();
			return res.status(400).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Reset failed attempts on successful login
		existingUser.failedLoginAttempts = 0;
		// Update status to active on successful login
		existingUser.status = "active";
		await existingUser.save();

		// Convert to object and remove sensitive data
		const userObject = existingUser.toObject();
		delete userObject.password;
		delete userObject.failedLoginAttempts; // Remove attempt count from response
		delete userObject.blockedAt; // Remove blocked time from response

		// Populate permissions from role
		const populatedPermissionsFromRole = await Role.findOne({
			name: existingUser.role,
		})
			.populate("permissions", "name -_id") // Populate only the name field
			.select("permissions -_id") // Exclude _id from Role model
			.lean();
		// format the permissions to an array of strings
		userObject.permissions =
			populatedPermissionsFromRole?.permissions?.map(
				(permission) => permission.name
			) || [];

		const token = jwt.sign(
			{ id: existingUser._id, email: existingUser.email },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN }
		);

		res.status(200).json({
			success: true,
			message: "Sign in successful",
			user: userObject,
			accessToken: token,
		});
	} catch (error) {
		next(error);
	}
};

export const signOut = async (req, res, next) => {
	try {
		const user = req?.user;
		
		const existingUser = await User.findOne({
			_id: user?._id,
			status: { $ne: "blocked" }, // Ensure user is not blocked
		});

		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Update the user's status to inactive
		existingUser.status = "inactive";
		await existingUser.save();

		res.status(200).json({
			success: true,
			message: "Sign out successful",
		});
	} catch (error) {
		next(error);
	}
};

export const verifyUser = async (req, res, next) => {
	try {
		const { accessToken } = req.body;
		if (!accessToken) {
			return res.status(404).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

		const user = await User.findOne({
			_id: decodedToken.id,
			status: { $ne: "blocked" },
		}).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Unauthorized",
			});
		}

		return res.status(200).json({
			success: true,
		});
	} catch (error) {
		error.statusCode = 401;
		next(error);
	}
};

// Forgot Password Controller
export const forgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		const user = await User.findOne({ email });

		if (user) {
			// Generate 6-digit code
			const resetCode = crypto.randomInt(100000, 999999).toString();

			user.resetPasswordToken = resetCode;
			user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

			await user.save();

			// Send email in the background (don't await)
			sendPasswordResetEmail(user.email, resetCode).catch((err) => {
				// Log email sending failure, but don't expose to client
				console.error("Failed to send password reset email:", err);
			});
		} else {
			// Return message if user doesn't exist
			return res.status(404).json({
				success: false,
				message: "User with the provided email does not exist.",
			});
		}

		// Always return success to prevent email enumeration
		res.status(200).json({
			success: true,
			message:
				"If your email is registered, you will receive a password reset code.",
		});
	} catch (error) {
		next(error);
	}
};

// Reset Password Controller
export const resetPassword = async (req, res, next) => {
	try {
		const { email, code, newPassword } = req.body;

		// Basic validation
		if (!email || !code || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Email, code, and new password are required",
			});
		}

		// Validate code format (6 digits)
		if (!/^\d{6}$/.test(code)) {
			return res.status(400).json({
				success: false,
				message: "Invalid code format. Code must be 6 digits.",
			});
		}

		// Validate new password strength (using regex from user model)
		const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
		if (!passwordRegex.test(newPassword)) {
			return res.status(400).json({
				success: false,
				message:
					"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
			});
		}

		// Find user by email, code, and ensure token hasn't expired
		const user = await User.findOne({
			email,
			resetPasswordToken: code,
			resetPasswordExpires: { $gt: Date.now() }, // Check if expiry is in the future
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Password reset code is invalid or has expired.",
			});
		}

		// Hash the new password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(newPassword, salt);

		// Clear the reset token fields
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		user.failedLoginAttempts = 0; // Reset failed attempts

		await user.save();

		res.status(200).json({
			success: true,
			message: "Password has been reset successfully.",
		});
	} catch (error) {
		next(error);
	}
};
