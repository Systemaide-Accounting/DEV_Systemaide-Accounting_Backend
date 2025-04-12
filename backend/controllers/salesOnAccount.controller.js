import SalesOnAccount from "../models/salesOnAccount.model.js";
import mongoose from "mongoose";
import { encryptTIN, decryptTIN } from "../helpers/encryptDecryptUtils.js";

export const getAllSalesOnAccount = async (req, res, next) => {
    try {
        let transactions = await SalesOnAccount.find({ isDeleted: { $ne: true } })
            .populate("location")

        // Decrypt TINs
        transactions = transactions.map((tx) => {
            return {
                ...tx.toObject(),
                tin: decryptTIN(tx.tin),
            };
        });

        res.status(200).json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        next(error);
    }
}

export const createSalesOnAccount = async (req, res, next) => {
    try {
        const transaction = { ...req.body };

        // Remove restricted fields
        delete transaction.isDeleted;
        delete transaction.deletedAt;

        if (transaction?.tin) {
            transaction.tin = encryptTIN(transaction.tin);
        }

        const newTransaction = await SalesOnAccount.create(transaction);

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
}

export const getSalesOnAccountById = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        let transaction = await SalesOnAccount.findById(transactionId)
            .populate("location");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        // Decrypt TIN
        transaction.tin = decryptTIN(transaction.tin);

        res.status(200).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
}

export const updateSalesOnAccount = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        let transaction = await SalesOnAccount.findById(transactionId)
            .populate("location");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        // Update the transaction
        const updatedTransaction = await SalesOnAccount.findByIdAndUpdate(
            transactionId,
            { ...req.body },
            { new: true, runValidators: true }
        );

        // Decrypt TIN
        updatedTransaction.tin = decryptTIN(updatedTransaction.tin);

        res.status(200).json({
            success: true,
            data: updatedTransaction,
        });
    } catch (error) {
        next(error);
    }
}

export const deleteSalesOnAccount = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const deletedTransaction = await SalesOnAccount.findByIdAndUpdate(
            transactionId,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
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
}
