import TransactionLog from "../models/transactionLogs.model.js";
import mongoose from "mongoose";

// Get all logs
export const getAllTransactionLogs = async (req, res, next) => {
	try {
		const logs = await TransactionLog.find({
			isDeleted: { $ne: true }, // Filter out deleted logs
		})
			.populate("transactionId") // Dynamically populated based on the `transaction` field
			.populate("remarks_by"); // Populate the remarks_by user reference if needed

		res.status(200).json({
			success: true,
			data: logs,
		});
	} catch (error) {
		next(error);
	}
};

export const getLogsForSpecificTransaction = async (req, res, next) => {
	try {
		const { transactionType } = req.params;

		// Validate the provided transaction type
		const validTransactions = [
			"CashDisbursementTransaction",
			"CashReceiptsTransaction",
			"SalesOnAccount",
			"PurchaseOnAccountTransaction",
			"GeneralJournal",
		];

		if (!validTransactions.includes(transactionType)) {
			return res.status(400).json({
				success: false,
				message: "Invalid transaction type",
			});
		}

		const logs = await TransactionLog.find({
			transaction: transactionType, // Filter by transaction type
			isDeleted: { $ne: true }, // Exclude deleted logs
		})
			.populate("transactionId") // Populate the transaction details
			.populate("remarks_by"); // Populate user who added the remarks if necessary

		if (!logs.length) {
			return res.status(404).json({
				success: false,
				message: "No logs found for this transaction",
			});
		}

		res.status(200).json({
			success: true,
			data: logs,
		});
	} catch (error) {
		next(error);
	}
};

export const getLogsForSpecificTransactionId = async (req, res, next) => {
	try {
		const { transactionType, transactionId } = req.params;

		// Validate the provided transaction type
		const validTransactions = [
			"CashDisbursementTransaction",
			"CashReceiptsTransaction",
			"SalesOnAccount",
			"PurchaseOnAccountTransaction",
			"GeneralJournal",
		];

		if (!validTransactions.includes(transactionType)) {
			return res.status(400).json({
				success: false,
				message: "Invalid transaction type",
			});
		}

		// Validate that the provided transactionId is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(transactionId)) {
			return res.status(404).json({
				success: false,
				message: "Invalid Transaction ID",
			});
		}

		const logs = await TransactionLog.find({
			transaction: transactionType, // Filter by transaction type
			transactionId: mongoose.Types.ObjectId(transactionId), // Filter by transactionId
			isDeleted: { $ne: true }, // Exclude deleted logs
		})
			.populate("transactionId") // Populate the transaction details
			.populate("remarks_by"); // Populate user who added the remarks if necessary

		if (!logs.length) {
			return res.status(404).json({
				success: false,
				message: "No logs found for this transaction ID",
			});
		}

		res.status(200).json({
			success: true,
			data: logs,
		});
	} catch (error) {
		next(error);
	}
};

// Get log by ID
export const getTransactionLogById = async (req, res, next) => {
	try {
		const { id: logId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(logId)) {
			return res.status(404).json({
				success: false,
				message: "Transaction Log not found",
			});
		}

		const log = await TransactionLog.findOne({
			_id: logId,
			isDeleted: { $ne: true }, // Filter out deleted logs
		})
			.populate("transactionId") // Dynamically populated based on the `transaction` field
			.populate("remarks_by");

		if (!log) {
			return res.status(404).json({
				success: false,
				message: "Transaction Log not found",
			});
		}

		res.status(200).json({
			success: true,
			data: log,
		});
	} catch (error) {
		next(error);
	}
};

// Create a new log
export const createTransactionLog = async (req, res, next) => {
	try {
		const payload = { ...req.body };

		// Validate `transaction` value against the allowed enum (optional)
		const validTransactions = [
			"CashDisbursementTransaction",
			"CashReceiptsTransaction",
			"SalesOnAccount",
			"PurchaseOnAccountTransaction",
			"GeneralJournal",
		];

		if (!validTransactions.includes(payload.transaction)) {
			return res.status(400).json({
				success: false,
				message: "Invalid transaction type",
			});
		}

		const newLog = await TransactionLog.create(payload);

		res.status(201).json({
			success: true,
			data: newLog,
		});
	} catch (error) {
		next(error);
	}
};

// Soft delete log by ID
export const deleteTransactionLog = async (req, res, next) => {
	try {
		const { id: logId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(logId)) {
			return res.status(404).json({
				success: false,
				message: "Transaction Log not found",
			});
		}

		const deletedLog = await TransactionLog.findByIdAndUpdate(
			{ _id: logId, isDeleted: false }, // Ensure the log is not already deleted
			{ isDeleted: true, deletedAt: new Date() },
			{ new: true }
		);

		if (!deletedLog) {
			return res.status(404).json({
				success: false,
				message: "Transaction Log not found",
			});
		}

		res.status(200).json({
			success: true,
			data: deletedLog,
		});
	} catch (error) {
		next(error);
	}
};

// Restore log by ID
export const restoreTransactionLog = async (req, res, next) => {
	try {
		const { id: logId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(logId)) {
			return res.status(404).json({
				success: false,
				message: "Transaction Log not found",
			});
		}

		const restoredLog = await TransactionLog.findByIdAndUpdate(
			{ _id: logId, isDeleted: true }, // Ensure the log is deleted before restoring
			{ isDeleted: false, restoredAt: new Date() },
			{ new: true }
		);

		if (!restoredLog) {
			return res.status(404).json({
				success: false,
				message: "Transaction Log not found",
			});
		}

		res.status(200).json({
			success: true,
			data: restoredLog,
		});
	} catch (error) {
		next(error);
	}
};
