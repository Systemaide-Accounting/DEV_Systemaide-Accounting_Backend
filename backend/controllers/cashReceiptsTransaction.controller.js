import cashReceiptsTransaction from "../models/cashReceiptsTransaction.model.js";
import mongoose from "mongoose";
import { encryptTIN, decryptTIN } from "../helpers/encryptDecryptUtils.js";

export const getAllCashReceiptsTransaction = async (req, res, next) => {
	try {
		let transactions = await cashReceiptsTransaction
			.find({ isDeleted: { $ne: true } })
			.populate("location")
			.populate("cashAccount");

		// Decrypt TINs
		transactions = transactions.map((tx) => {
			return {
				...tx.toObject(),
				// tin: decryptTIN(tx.tin),
				tin: tx.tin ? decryptTIN(tx.tin) : "",
			};
		});

		res.status(200).json({
			success: true,
			data: transactions,
		});
	} catch (error) {
		next(error);
	}
};

export const createCashReceiptsTransaction = async (req, res, next) => {
	try {
		const transaction = { ...req.body };
		
		// Remove restricted fields
		delete transaction.isDeleted;
		delete transaction.deletedAt;

		if (transaction?.tin) {
			transaction.tin = encryptTIN(transaction.tin);
		}

		const newTransaction = await cashReceiptsTransaction.create(transaction);

		res.status(201).json({
			success: true,
			data: {
				...newTransaction.toObject(),
				tin: decryptTIN(newTransaction.tin), // Decrypt on return
			},
		});
	} catch (error) {
		next(error);
	}
};

export const getCashReceiptsTransactionById = async (req, res, next) => {
	try {
		const { id: transactionId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(transactionId)) {
			return res.status(404).json({
				success: false,
				message: "Cash receipts transaction not found",
			});
		}

		const transaction = await cashReceiptsTransaction
			.findOne({ _id: transactionId, isDeleted: { $ne: true } })
			.populate("location")
			.populate("cashAccount");

		if (!transaction) {
			return res.status(404).json({
				success: false,
				message: "Cash receipts transaction not found",
			});
		}

		res.status(200).json({
			success: true,
			data: {
				...transaction.toObject(),
				tin: decryptTIN(transaction.tin),
			},
		});
	} catch (error) {
		next(error);
	}
};

export const updateCashReceiptsTransaction = async (req, res, next) => {
	try {
		const { id: transactionId } = req.params;
		const transaction = { ...req.body };

		delete transaction.isDeleted;
		delete transaction.deletedAt;

		if (!mongoose.Types.ObjectId.isValid(transactionId)) {
			return res.status(404).json({
				success: false,
				message: "Cash receipts transaction not found",
			});
		}

		if (transaction.tin) {
			transaction.tin = encryptTIN(transaction.tin);
		}

		const updatedTransaction = await cashReceiptsTransaction.findOneAndUpdate(
			{ _id: transactionId, isDeleted: { $ne: true } },
			transaction,
			{ new: true, runValidators: true }
		);

		if (!updatedTransaction) {
			return res.status(404).json({
				success: false,
				message: "Cash receipts transaction not found",
			});
		}

		res.status(200).json({
			success: true,
			data: {
				...updatedTransaction.toObject(),
				tin: decryptTIN(updatedTransaction.tin),
			},
		});
	} catch (error) {
		next(error);
	}
};

export const deleteCashReceiptsTransaction = async (req, res, next) => {
	try {
		const { id: transactionId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(transactionId)) {
			return res.status(404).json({
				success: false,
				message: "Cash receipts transaction not found",
			});
		}

		const deletedTransaction = await cashReceiptsTransaction.findOneAndUpdate(
			{ _id: transactionId, isDeleted: { $ne: true } },
			{ isDeleted: true, deletedAt: new Date() },
			{ new: true, runValidators: true }
		);

		if (deletedTransaction.isDeleted) {
			return res.status(400).json({
				success: false,
				message: "Cash receipts transaction already deleted",
			});
		}

		if (!deletedTransaction) {
			return res.status(404).json({
				success: false,
				message: "Cash receipts transaction not found",
			});
		}

		res.status(200).json({
			success: true,
			data: deletedTransaction,
		});
	} catch (error) {
		next(error);
	}
};

export const restoreCashReceiptsTransaction = async (req, res, next) => {
	try {
		const { id: transactionId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(transactionId)) {
			return res.status(404).json({
				success: false,
				message: "Cash receipts transaction not found",
			});
		}

		const restoredTransaction = await cashReceiptsTransaction.findOneAndUpdate(
			{ _id: transactionId, isDeleted: true },
			{ isDeleted: false, restoredAt: new Date() },
			{ new: true, runValidators: true }
		);

		if (!restoredTransaction.isDeleted) {
			return res.status(400).json({
				success: false,
				message: "Cash receipts transaction is not deleted",
			});
		}

		if (!restoredTransaction) {
			return res.status(404).json({
				success: false,
				message: "Cash receipts transaction not found",
			});
		}

		res.status(200).json({
			success: true,
			data: restoredTransaction,
		});
	} catch (error) {
		next(error);
	}
}