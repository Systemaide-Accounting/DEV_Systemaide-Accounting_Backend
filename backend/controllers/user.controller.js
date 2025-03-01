import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = req.body;
    // console.log(user);
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = await User.create(user);

    res.status(201).json({
      success: true,
      data: newUser,
    });

  } catch (error) {
    next(error);
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const { id:userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = await User.findOne({
      _id: userId,
      status: { $ne: "blocked" },
    }).select("-password");

    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const user = req.body;

    if(!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the role is null or undefined
    // if (!user?.role) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Role is required",
    //   });
    // }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, status: { $ne: "blocked" } }, 
      user, 
      { 
        new: true, runValidators: true, // Run schema validations
      }
    );

    if(!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
    
  } catch (error) {
    next(error)
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // update the status into blocked
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, status: { $ne: "blocked" } },
      { status: "blocked", blockedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};