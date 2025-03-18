import mongoose from "mongoose";
import Branch from "../models/branch.model.js";

const isBranchTINExisting = async (branch) => {
    const existingBranch = await Branch.findOne({
        tin: branch?.tin,
        isDeleted: { $ne: true },
    });
    return existingBranch;
};

export const getAllBranches = async (req, res, next) => {
    try {
        const branches = await Branch.find({ isDeleted: { $ne: true } });
        res.status(200).json({
            success: true,
            data: branches,
        });
    } catch (error) {
        next(error);
    }
};

export const createBranch = async (req, res, next) => {
    try {
        const branch = { ...req.body };

        // Remove restricted fields
        delete branch.isDeleted;
        delete branch.deletedAt;

        const existingBranch = await isBranchTINExisting(branch);

        if (existingBranch) {
            return res.status(400).json({
                success: false,
                message: "Branch TIN already exists",
            });
        }

        const newBranch = await Branch.create(branch);
        
        res.status(201).json({
            success: true,
            data: newBranch,
        });
    } catch (error) {
        next(error);
    }
};

export const getBranchById = async (req, res, next) => {
    try {
        const { id: branchId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(branchId)) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        const branch = await Branch.findOne({
            _id: branchId,
            isDeleted: { $ne: true },
        });

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            data: branch,
        });
    } catch (error) {
        next(error);
    }
};

export const updateBranch = async (req, res, next) => {
    try {
        const { id: branchId } = req.params;
        const branch = { ...req.body };

        // Remove restricted fields
        delete branch.isDeleted;
        delete branch.deletedAt;

        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        const existingBranch = await Branch.findOne({
            tin: branch?.tin,
            isDeleted: { $ne: true },
            _id: { $ne: branchId },
        });

        if (existingBranch) {
            return res.status(400).json({
                success: false,
                message: "Branch TIN already exists",
            });
        }

        const updatedBranch = await Branch.findOneAndUpdate(
            { _id: branchId, isDeleted: { $ne: true } },
            branch,
            { new: true, runValidators: true }
        );

        if (!updatedBranch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedBranch,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBranch = async (req, res, next) => {
    try {
        const { id: branchId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        const deletedBranch = await Branch.findOneAndUpdate(
            { _id: branchId, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!deletedBranch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedBranch,
        });
    } catch (error) {
        next(error);
    }
};