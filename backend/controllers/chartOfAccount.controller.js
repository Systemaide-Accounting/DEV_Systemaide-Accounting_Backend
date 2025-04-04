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
    if (!account?.parentAccount) return true;
    const existingParentAccount = await ChartOfAccount.findOne({
      _id: account?.parentAccount,
      isDeleted: { $ne: true },
    });
    return existingParentAccount;
};

export const getAllAccounts = async (req, res, next) => {
    try {
        const accounts = await ChartOfAccount.find({ isDeleted: { $ne: true } }).populate("parentAccount");

        // check if each parentAccount of account is deleted
        accounts.forEach((account) => {
            if (account.parentAccount && account.parentAccount.isDeleted) {
                account.parentAccount = null;
            }
        });

        res.status(200).json({
          success: true,
          data: accounts,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllParentAccounts = async (req, res, next) => {
    try {
        const parentAccounts = await ChartOfAccount.find({
            parentAccount: null,
            isDeleted: { $ne: true },
        });

        res.status(200).json({
            success: true,
            data: parentAccounts,
        });
    } catch (error) {
        next(error);
    }
};

// get all child accounts of a parent account
export const getChildAccounts = async (req, res, next) => {
    try {
        const { id: parentAccountId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(parentAccountId)) {
            return res.status(404).json({
                success: false,
                message: "Parent account not found",
            });
        }

        const childAccounts = await ChartOfAccount.find({
            parentAccount: parentAccountId,
            isDeleted: { $ne: true },
        });

        res.status(200).json({
            success: true,
            data: childAccounts,
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

        if ((account.parentAccount && !mongoose.Types.ObjectId.isValid(account.parentAccount)) || !parentAccount) {
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

        // check if parentAccount is deleted
        if (newAccount.parentAccount && newAccount.parentAccount.isDeleted) {
            newAccount.parentAccount = null;
        }

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
        }).populate("parentAccount");

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        // check if parentAccount is deleted
        if (account.parentAccount && account.parentAccount.isDeleted) {
            account.parentAccount = null;
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

        const parentAccount = await isParentAccountExisting(account);

        if ((account?.parentAccount && !mongoose.Types.ObjectId.isValid(account.parentAccount)) || !parentAccount) {
            return res.status(400).json({
                success: false,
                message: "Invalid parent account code",
            });
        }

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
        ).populate("parentAccount");

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        // check if parentAccount is deleted
        if (updatedAccount.parentAccount && updatedAccount.parentAccount.isDeleted) {
            updatedAccount.parentAccount = null;
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