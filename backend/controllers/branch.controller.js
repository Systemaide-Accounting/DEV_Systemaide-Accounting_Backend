import mongoose from "mongoose";
import Branch from "../models/branch.model.js";
import { encryptTIN, decryptTIN } from "../helpers/encryptDecryptUtils.js";

const isBranchTINExisting = async (branch) => {
	const existingBranch = await Branch.findOne({
		tin: branch?.tin,
		isDeleted: { $ne: true },
	});
	return existingBranch;
};

export const getAllBranches = async (req, res, next) => {
	try {
		let branches = await Branch.find({ isDeleted: { $ne: true } });

		// Decrypt TINs
		branches = branches.map((branch) => {
			const branchObj = branch.toObject();
			try {
				// Only attempt to decrypt if tin exists and is not empty
				if (branchObj?.tin) {
					branchObj.tin = decryptTIN(branchObj?.tin);
				}
			} catch (decryptError) {
				console.error(
					`Failed to decrypt TIN for transaction ${branchObj._id}:`,
					decryptError.message
				);
				branchObj.tin = ""; // Set to empty string on decryption failure
			}
			return branchObj;
		});

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

		// Encrypt TIN before saving
		if (branch?.tin) {
			branch.tin = encryptTIN(branch.tin);
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

		if (!mongoose.Types.ObjectId.isValid(branchId)) {
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
			data: {
				...branch.toObject(),
				tin: decryptTIN(branch.tin), // Decrypt TIN before sending response
			},
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

		// Encrypt TIN before saving
		if (branch?.tin) {
			branch.tin = encryptTIN(branch.tin);
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

		// if (deletedBranch.isDeleted) {
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "Branch is already deleted",
		// 	});
		// }

		res.status(200).json({
			success: true,
			data: deletedBranch,
		});
	} catch (error) {
		next(error);
	}
};

export const restoreBranch = async (req, res, next) => {
	try {
		const { id: branchId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(branchId)) {
			return res.status(404).json({
				success: false,
				message: "Branch not found",
			});
		}

		const restoredBranch = await Branch.findOneAndUpdate(
			{ _id: branchId, isDeleted: true },
			{ isDeleted: false, restoredAt: new Date() },
			{ new: true, runValidators: true }
		);

		if (!restoredBranch) {
			return res.status(404).json({
				success: false,
				message: "Branch not found",
			});
		}

		// if (!restoredBranch.isDeleted) {
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "Branch is not deleted",
		// 	});
		// }

		res.status(200).json({
			success: true,
			data: restoredBranch,
		});
	} catch (error) {
		next(error);
	}
};

export const getAllDeletedBranches = async (req, res, next) => {
	try {
		let deletedBranches = await Branch.find({ isDeleted: true });

		// Decrypt TINs
		deletedBranches = deletedBranches.map((branch) => {
			const branchObj = branch.toObject();
			try {
				// Only attempt to decrypt if tin exists and is not empty
				if (branchObj?.tin) {
					branchObj.tin = decryptTIN(branchObj?.tin);
				}
			} catch (decryptError) {
				console.error(
					`Failed to decrypt TIN for transaction ${branchObj._id}:`,
					decryptError.message
				);
				branchObj.tin = ""; // Set to empty string on decryption failure
			}
			return branchObj;
		});

		res.status(200).json({
			success: true,
			data: deletedBranches,
		});
	} catch (error) {
		next(error);
	}
};