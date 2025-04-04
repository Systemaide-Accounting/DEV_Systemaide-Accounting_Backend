import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import Role from "../models/role.model.js";

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
        status: { $ne: "blocked" },
      });

      const isCredentialsCorrect =
        existingUser &&
        (await bcrypt.compare(password, existingUser?.password));

      if (!isCredentialsCorrect) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Convert to object and remove sensitive data
      const userObject = existingUser.toObject();
      delete userObject.password;

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
      status: { $ne: "blocked" }
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