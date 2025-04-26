import mongoose from "mongoose";
import { encryptTIN, decryptTIN } from "../helpers/encryptDecryptUtils.js";
import CashDisbursementTransaction from "../models/cashDisbursementTransaction.model.js";
import CashReceiptsTransaction from "../models/cashReceiptsTransaction.model.js";
import SalesOnAccount from "../models/salesOnAccount.model.js";
import PurchaseOnAccountTransaction from "../models/purchaseOnAccountTransaction.model.js";
import GeneralJournal from "../models/generalJournal.model.js";

/**
 * @description Get cash disbursement transactions report within a date range.
 * @route GET /api/reports/cash-disbursement
 * @param {string} req.body.startDate - Start date for the report (YYYY-MM-DD)
 * @param {string} req.body.endDate - End date for the report (YYYY-MM-DD)
 * @returns {object} JSON response with success status and decrypted transaction data
 */
export const getCashDisbursementTransactionReport = async (req, res, next) => {
	try {
		const { startDate, endDate } = req.body;

		if (!startDate || !endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date and end date are required",
			});
		}

		if (startDate > endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date cannot be greater than end date",
			});
		}

		const transactions = await CashDisbursementTransaction.find({
		date: {
			$gte: new Date(startDate),
			$lte: new Date(endDate),
		},
		isDeleted: { $ne: true },
		})
		.populate("location")
		.populate("payeeName")
		.populate("cashAccount");

		// Decrypt TINs
		const decryptedTransactions = transactions.map((tx) => {
			const txObj = tx.toObject();
			try {
				if (txObj.tin) {
					txObj.tin = decryptTIN(txObj.tin);
				}
			} catch (decryptError) {
				console.error(
					`Failed to decrypt TIN for transaction ${txObj._id}:`,
					decryptError.message
				);
				txObj.tin = "";
			}
			return txObj;
		});

		res.status(200).json({
			success: true,
			data: decryptedTransactions,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * @description Get cash receipts transactions report within a date range.
 * @route GET /api/reports/cash-receipts
 * @param {string} req.body.startDate - Start date for the report (YYYY-MM-DD)
 * @param {string} req.body.endDate - End date for the report (YYYY-MM-DD)
 * @returns {object} JSON response with success status and decrypted transaction data
 */
export const getCashReceiptsTransactionReport = async (req, res, next) => {
	try {
		const { startDate, endDate } = req.body;

		if (!startDate || !endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date and end date are required",
			});
		}

		if (startDate > endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date cannot be greater than end date",
			});
		}

		const transactions = await CashReceiptsTransaction.find({
			date: {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			},
			isDeleted: { $ne: true },
		}).populate("location");

		// Decrypt TINs
		const decryptedTransactions = transactions.map((tx) => {
			const txObj = tx.toObject();
			try {
				if (txObj.tin) {
					txObj.tin = decryptTIN(txObj.tin);
				}
			} catch (decryptError) {
				console.error(
					`Failed to decrypt TIN for transaction ${txObj._id}:`,
					decryptError.message
				);
				txObj.tin = "";
			}
			return txObj;
		});

		res.status(200).json({
			success: true,
			data: decryptedTransactions,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * @description Get sales on account transactions report within a date range.
 * @route GET /api/reports/sales-on-account
 * @param {string} req.body.startDate - Start date for the report (YYYY-MM-DD)
 * @param {string} req.body.endDate - End date for the report (YYYY-MM-DD)
 * @returns {object} JSON response with success status and decrypted transaction data
 */
export const getSalesOnAccountReport = async (req, res, next) => {
	try {
		const { startDate, endDate } = req.body;

		if (!startDate || !endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date and end date are required",
			});
		}

		if (startDate > endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date cannot be greater than end date",
			});
		}

		const transactions = await SalesOnAccount.find({
			date: {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			},
			isDeleted: { $ne: true },
		}).populate("location");

		const decryptedTransactions = transactions.map((tx) => {
			const txObj = tx.toObject();
			try {
				if (txObj.tin) {
					txObj.tin = decryptTIN(txObj.tin);
				}
			} catch (err) {
				console.error(`TIN decryption error: ${err.message}`);
				txObj.tin = "";
			}
			return txObj;
		});

		res.status(200).json({ success: true, data: decryptedTransactions });
	} catch (error) {
		next(error);
	}
};

/**
 * @description Get purchase on account transactions report within a date range.
 * @route GET /api/reports/purchase-on-account
 * @param {string} req.body.startDate - Start date for the report (YYYY-MM-DD)
 * @param {string} req.body.endDate - End date for the report (YYYY-MM-DD)
 * @returns {object} JSON response with success status and decrypted transaction data
 */
export const getPurchaseOnAccountReport = async (req, res, next) => {
	try {
		const { startDate, endDate } = req.body;

		if (!startDate || !endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date and end date are required",
			});
		}

		if (startDate > endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date cannot be greater than end date",
			});
		}

		const transactions = await PurchaseOnAccountTransaction.find({
			date: {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			},
			isDeleted: { $ne: true },
		})
			.populate("location")
			.populate("supplierName");

		const decryptedTransactions = transactions.map((tx) => {
			const txObj = tx.toObject();
			try {
				if (txObj.tin) {
					txObj.tin = decryptTIN(txObj.tin);
				}
			} catch (err) {
				console.error(`TIN decryption error: ${err.message}`);
				txObj.tin = "";
			}
			return txObj;
		});

		res.status(200).json({ success: true, data: decryptedTransactions });
	} catch (error) {
		next(error);
	}
};

/**
 * @description Get general journal transactions report within a date range.
 * @route GET /api/reports/general-journal
 * @param {string} req.body.startDate - Start date for the report (YYYY-MM-DD)
 * @param {string} req.body.endDate - End date for the report (YYYY-MM-DD)
 * @returns {object} JSON response with success status and transaction data
 */
export const getGeneralJournalReport = async (req, res, next) => {
	try {
		const { startDate, endDate } = req.body;

		if (!startDate || !endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date and end date are required",
			});
		}

		if (startDate > endDate) {
			return res.status(400).json({
				success: false,
				message: "Start date cannot be greater than end date",
			});
		}

		const transactions = await GeneralJournal.find({
			date: {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			},
			isDeleted: { $ne: true },
		}).populate("location");

		res.status(200).json({ success: true, data: transactions });
	} catch (error) {
		next(error);
	}
};
