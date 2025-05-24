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
            const txObj = tx.toObject();
            try {
              // Only attempt to decrypt if tin exists and is not empty
              if (txObj.tin) {
                txObj.tin = decryptTIN(txObj.tin);
              }
            } catch (decryptError) {
              console.error(
                `Failed to decrypt TIN for transaction ${txObj._id}:`,
                decryptError.message
              );
              txObj.tin = ""; // Set to empty string on decryption failure
            }
            return txObj;
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
                message: "Cash disbursement transaction not found",
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
                message: "Cash disbursement transaction not found",
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
                message: "Cash disbursement transaction not found",
            });
        }

        if (transaction?.tin) {
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
                message: "Cash disbursement transaction not found",
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
                message: "Cash disbursement transaction not found",
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
                message: "Cash disbursement transaction not found",
            });
        }

        // if (deletedTransaction.isDeleted) {
        //   return res.status(400).json({
        //     success: false,
        //     message: "Cash disbursement is already deleted",
        //   });
        // }

        res.status(200).json({
            success: true,
            data: deletedTransaction,
        });
    } catch (error) {
        next(error);
    }
};

export const restoreCashDisbursementTransaction = async (req, res, next) => {
    try {
        const { id: transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(404).json({
                success: false,
                message: "Cash disbursement transaction not found",
            });
        }

        const restoredTransaction = await CashDisbursementTransaction.findOneAndUpdate(
            { _id: transactionId, isDeleted: true },
            { isDeleted: false, restoredAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!restoredTransaction) {
            return res.status(404).json({
                success: false,
                message: "Cash disbursement transaction not found",
            });
        }

        if(!restoredTransaction.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Cash disbursement transaction is not deleted",
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

export const getAllDeletedCashDisbursementTransactions = async (req, res, next) => {
    try {
        let deletedCashDisbursementTransactions = await CashDisbursementTransaction.find({
            isDeleted: true,
        })
            .populate("location")
            .populate("payeeName")
            .populate("cashAccount");
        
        deletedCashDisbursementTransactions = deletedCashDisbursementTransactions.map(
            (tx) => {
            const txObj = tx.toObject();
            try {
                // Only attempt to decrypt if tin exists and is not empty
                if (txObj.tin) {
                txObj.tin = decryptTIN(txObj.tin);
                }
            } catch (decryptError) {
                console.error(
                `Failed to decrypt TIN for transaction ${txObj._id}:`,
                decryptError.message
                );
                txObj.tin = ""; // Set to empty string on decryption failure
            }
                return txObj;
            }
        );

        res.status(200).json({
          success: true,
          data: deletedCashDisbursementTransactions,
        });
    } catch (error) {
        next(error);
    }
};