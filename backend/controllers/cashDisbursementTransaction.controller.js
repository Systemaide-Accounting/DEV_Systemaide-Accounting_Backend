import CashDisbursementTransaction from "../models/cashDisbursementTransaction.model.js";
import mongoose from "mongoose";
import { encryptTIN, decryptTIN } from "../helpers/encryptDecryptUtils.js";

export const getAllCashDisbursementTransactions = async (req, res, next) => {
    try {
        let cashDisbursementTransactions = await CashDisbursementTransaction.find({
            isDeleted: { $ne: true },
        })
            .populate("location")
            .populate("payeeName")
            .populate("cashAccount");

        cashDisbursementTransactions = cashDisbursementTransactions.map(
          (tx) => {
            return {
              ...tx.toObject(),
              tin: decryptTIN(tx.tin),
            };
          }
        );

        res.status(200).json({
            success: true,
            data: cashDisbursementTransactions,
        });
    } catch (error) {
        next(error);
    }
};

export const createCashDisbursementTransaction = async (req, res, next) => {
    try {
        const transaction = { ...req.body };

        // Remove restricted fields
        delete transaction.isDeleted;
        delete transaction.deletedAt;

        if (transaction?.tin) {
            transaction.tin = encryptTIN(transaction.tin);
        }

        const newTransaction = await CashDisbursementTransaction.create(transaction);

        res.status(201).json({
            success: true,
            data: {
                ...newTransaction.toObject(),
                tin: decryptTIN(newTransaction.tin),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getCashDisbursementTransactionById = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const transaction = await CashDisbursementTransaction.findOne({
            _id: transactionId,
            isDeleted: { $ne: true },
        })
            .populate("location")
            .populate("payeeName")
            .populate("cashAccount");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
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

export const updateCashDisbursementTransaction = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;
        const transaction = { ...req.body };

        // Remove restricted fields
        delete transaction.isDeleted;
        delete transaction.deletedAt;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        if (transaction.tin) {
            transaction.tin = encryptTIN(transaction.tin);
        }

        const updatedTransaction = await CashDisbursementTransaction.findOneAndUpdate(
            { _id: transactionId, isDeleted: { $ne: true } },
            transaction,
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
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

export const deleteCashDisbursementTransaction = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const deletedTransaction =
          await CashDisbursementTransaction.findOneAndUpdate(
            { _id: transactionId, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date() },
            { new: true, runValidators: true }
          );
        
        if (!deletedTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
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

