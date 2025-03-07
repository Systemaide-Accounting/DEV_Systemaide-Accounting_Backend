import ChartOfAccount from "../models/chartOfAccount.model.js";
import mongoose from "mongoose";

const isAccountCodeExisting = async (account) => {
    const existingAccount = await ChartOfAccount.findOne({
        accountCode: account?.accountCode,
        isDeleted: { $ne: true },
    });
    return existingAccount;
};

const isParentAccountExisting = async (account) => {
    const existingParentAccount = await ChartOfAccount.findOne({
      _id: account?.parentAccount,
      isDeleted: { $ne: true },
    });
    return existingParentAccount;
};

export const getAllAccounts = async (req, res, next) => {
    try {
        const accounts = await ChartOfAccount.find({ isDeleted: { $ne: true } });
        res.status(200).json({
          success: true,
          data: accounts,
        });
    } catch (error) {
        next(error);
    }
};

export const createAccount = async (req, res, next) => {
    try {
        const account = { ...req.body };

        // Remove restricted fields
        delete account.isDeleted;
        delete account.deletedAt;

        if(!account?.parentAccount) {
            delete account.parentAccount;
        }

        const parentAccount = await isParentAccountExisting(account);
        
        if ((account?.parentAccount && !mongoose.Types.ObjectId.isValid(account.parentAccount)) || !parentAccount) {
            return res.status(400).json({
                success: false,
                message: "Invalid parent account code",
            });
        }

        const existingAccount = await isAccountCodeExisting(account);

        if (existingAccount) {
            return res.status(400).json({
                success: false,
                message: "Account code already exists",
            });
        }

        // const newAccount = await ChartOfAccount.create(account);
        let newAccount = await ChartOfAccount.create(account);
        newAccount = await newAccount.populate("parentAccount");

        res.status(201).json({
            success: true,
            data: newAccount,
        });
    } catch (error) {
        next(error);
    }
};

export const getAccountById = async (req, res, next) => {
    try {
        const { id: accountId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        const account = await ChartOfAccount.findOne({
            _id: accountId,
            isDeleted: { $ne: true },
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        res.status(200).json({
            success: true,
            data: account,
        });
    } catch (error) {
        next(error);
    }
};

export const updateAccount = async (req, res, next) => {
    try {
        const { id: accountId } = req.params;
        const account = { ...req.body };

        // Remove restricted fields
        delete account.isDeleted;
        delete account.deletedAt;

        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        const existingAccount = await ChartOfAccount.findOne({
            accountCode: account?.accountCode,
            _id: { $ne: accountId },
            isDeleted: { $ne: true },
        });

        if (existingAccount) {
            return res.status(400).json({
                success: false,
                message: "Account code already exists",
            });
        }

        const updatedAccount = await ChartOfAccount.findOneAndUpdate(
            { _id: accountId, isDeleted: { $ne: true } },
            account,
            { new: true, runValidators: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedAccount,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAccount = async (req, res, next) => {
    try {
        const { id: accountId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        const deletedAccount = await ChartOfAccount.findOneAndUpdate(
            { _id: accountId, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!deletedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedAccount,
        });
    } catch (error) {
        next(error);
    }
};