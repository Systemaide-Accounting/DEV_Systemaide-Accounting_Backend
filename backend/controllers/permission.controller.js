import Permission from "../models/permission.model.js";
import mongoose from "mongoose";

export const getAllPermissions = async (req, res, next) => {
    try {
        const permissions = await Permission.find({});
        res.status(200).json({
            success: true,
            data: permissions,
        });
    } catch (error) {
        next(error);
    }
};

export const createPermission = async (req, res, next) => {
    try {
        const permission = { ...req.body };
        
        const existingPermission = await Permission.findOne({ name: permission.name });
        
        if (existingPermission) {
            return res.status(400).json({
                success: false,
                message: "Permission name already exists",
            });
        }
        
        const newPermission = await Permission.create(permission);
        
        res.status(201).json({
            success: true,
            data: newPermission,
        });
    } catch (error) {
        next(error);
    }
};

export const getPermissionById = async (req, res, next) => {
    try {
        const { id: permissionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(permissionId)) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }

        const permission = await Permission.findOne({
            _id: permissionId,
        });

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }

        res.status(200).json({
            success: true,
            data: permission,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePermission = async (req, res, next) => {
    try {
        const { id: permissionId } = req.params;
        const permission = { ...req.body };

        if (!mongoose.Types.ObjectId.isValid(permissionId)) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }

        const existingPermission = await Permission.findOne({ 
            name: permission.name,
            _id: { $ne: permissionId },
        });

        if (existingPermission) {
            return res.status(400).json({
                success: false,
                message: "Permission name already exists",
            });
        }

        const updatedPermission = await Permission.findByIdAndUpdate(
            permissionId,
            permission,
            { new: true, runValidators: true }
        );

        if (!updatedPermission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedPermission,
        });
    } catch (error) {
        next(error);
    }
};

export const deletePermission = async (req, res, next) => {
    try {
        const { id: permissionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(permissionId)) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }

        const deletedPermission = await Permission.findByIdAndDelete(permissionId);

        if (!deletedPermission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedPermission,
        });
    } catch (error) {
        next(error);
    }
};