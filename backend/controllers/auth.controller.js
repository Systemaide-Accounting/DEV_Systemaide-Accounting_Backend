import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

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

      const existingUser = await User.findOne({ email });

      const isCredentialsCorrect =
        existingUser && (await bcrypt.compare(password, existingUser.password));

      if (!isCredentialsCorrect) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Convert to object and remove sensitive data
      const userObject = existingUser.toObject();
      delete userObject.password;

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