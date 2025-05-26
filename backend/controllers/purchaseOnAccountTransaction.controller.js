import PurchaseOnAccountTransaction from "../models/purchaseOnAccountTransaction.model.js";
import AgentInfo from "../models/agentInfo.model.js";
import mongoose from "mongoose";
import { encryptTIN, decryptTIN } from "../helpers/encryptDecryptUtils.js";

export const getAllPurchaseOnAccountTransactions = async (req, res, next) => {
    try {
        let transactions = await PurchaseOnAccountTransaction.find({
            isDeleted: { $ne: true },
        })
            .populate("location")
            .populate("supplierName");

        transactions = transactions.map((tx) => ({
            ...tx.toObject(),
            tin: decryptTIN(tx.tin),
        }));

        res.status(200).json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        next(error);
    }
};

export const createPurchaseOnAccountTransaction = async (req, res, next) => {
    try {
        const transaction = { ...req.body };

        delete transaction.isDeleted;
        delete transaction.deletedAt;

        if (transaction?.tin) {
            transaction.tin = encryptTIN(transaction.tin);
        }

        const newTransaction = await PurchaseOnAccountTransaction.create(transaction);

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

export const getPurchaseOnAccountTransactionById = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const transaction = await PurchaseOnAccountTransaction.findOne({
            _id: transactionId,
            isDeleted: { $ne: true },
        })
            .populate("location")
            .populate("supplierName");

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

export const updatePurchaseOnAccountTransaction = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;
        const transaction = { ...req.body };

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

        const updatedTransaction = await PurchaseOnAccountTransaction.findOneAndUpdate(
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

export const deletePurchaseOnAccountTransaction = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const deletedTransaction = await PurchaseOnAccountTransaction.findOneAndUpdate(
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

        if (deletedTransaction.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Transaction is already deleted",
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

export const restorePurchaseOnAccountTransaction = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const restoredTransaction = await PurchaseOnAccountTransaction.findOneAndUpdate(
            { _id: transactionId, isDeleted: true },
            { isDeleted: false, restoredAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!restoredTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        if (!restoredTransaction.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Transaction is not deleted",
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

export const getAllDeletedPurchaseOnAccountTransactions = async (req, res, next) => {
    try {
        let deletedTransactions = await PurchaseOnAccountTransaction.find({
            isDeleted: true,
        })
            .populate("location")
            .populate("supplierName");

        deletedTransactions = deletedTransactions.map((tx) => ({
            ...tx.toObject(),
            tin: decryptTIN(tx?.tin),
        }));

        res.status(200).json({
          success: true,
          data: deletedTransactions,
        });
    } catch (error) {
        next(error);
    }
}