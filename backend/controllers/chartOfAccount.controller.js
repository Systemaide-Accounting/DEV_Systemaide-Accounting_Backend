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

// Helper function to recursively populate subAccounts and filter deleted ones
const populateSubAccounts = async (account) => {
    if (account.subAccounts && account.subAccounts.length > 0) {
        const populatedSubAccounts = await ChartOfAccount.find({
            _id: { $in: account.subAccounts },
            isDeleted: { $ne: true },
        }).populate("subAccounts");

        // Filter out deleted subAccounts
        account.subAccounts = populatedSubAccounts.filter(
            (subAccount) => !subAccount.isDeleted
        );
    }
    return account;
};

export const getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await ChartOfAccount.find({ isDeleted: { $ne: true } })
      .populate({
        path: "parentAccount",
        populate: { path: "parentAccount" }, // Recursively populate parentAccount
      })
      .populate({
        path: "subAccounts",
        populate: { path: "parentAccount" }, // Populate parentAccount of each subAccount
      });

    // Filter out deleted parent accounts if parentAccount is an array
    accounts.forEach((account) => {
      if (account.parentAccount && Array.isArray(account.parentAccount)) {
        account.parentAccount = account.parentAccount.filter(
          (parent) => !parent.isDeleted
        );
      }

      if (account.subAccounts && account.subAccounts.length > 0) {
        account.subAccounts.forEach((subAccount) => {
          if (
            subAccount.parentAccount &&
            Array.isArray(subAccount.parentAccount)
          ) {
            subAccount.parentAccount = subAccount.parentAccount.filter(
              (parent) => !parent.isDeleted
            );
          }
        });
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
      parentAccount: { $size: 0 }, // Find accounts with an empty parentAccount array
      isDeleted: { $ne: true },
    }).populate({
      path: "subAccounts", // Populate the direct sub-accounts
      match: { isDeleted: { $ne: true } }, // Ensure populated sub-accounts are not deleted
      populate: [
        // Populate fields within the sub-accounts
        {
          path: "parentAccount", // Populate the parent of the sub-account
          match: { isDeleted: { $ne: true } }, // Ensure the parent isn't deleted
        },
        {
          path: "subAccounts", // Populate the sub-accounts of the sub-account (if needed)
          match: { isDeleted: { $ne: true } },
          // You can continue nesting populate here if necessary
          // populate: { path: 'parentAccount', match: { isDeleted: { $ne: true } } }
        },
      ],
    });

    // Optional: Filter out parent accounts where all subAccounts might have been filtered out by the 'match' clause
    // const filteredParentAccounts = parentAccounts.filter(account => account.subAccounts.length > 0 || !account.subAccounts); // Or adjust logic as needed

    res.status(200).json({
      success: true,
      // data: filteredParentAccounts, // Use if filtering is applied
      data: parentAccounts, // Use original if no filtering needed
    });
  } catch (error) {
    next(error);
  }
};

// get all child accounts based on a parent account
export const getChildAccounts = async (req, res, next) => {
  try {
    const { id: parentAccountId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(parentAccountId)) {
      return res.status(404).json({
        success: false,
        message: "Parent account not found",
      });
    }

    // Find child accounts where the parentAccount array includes the given parentAccountId
    const childAccounts = await ChartOfAccount.find({
      parentAccount: { $in: [parentAccountId] },
      isDeleted: { $ne: true },
    }).populate({
      path: "subAccounts",
      populate: { path: "parentAccount" }, // Populate parentAccount of each subAccount
    });

    // Recursively populate parentAccount for each subAccount
    const populatedChildAccounts = await Promise.all(
      childAccounts.map(async (account) => {
        if (account.subAccounts && account.subAccounts.length > 0) {
          account.subAccounts = await Promise.all(
            account.subAccounts.map(async (subAccount) => {
              return await ChartOfAccount.findById(subAccount._id)
                .populate("parentAccount")
                .populate("subAccounts");
            })
          );
        }
        return account;
      })
    );

    res.status(200).json({
      success: true,
      data: populatedChildAccounts,
    });
  } catch (error) {
    next(error);
  }
};

// get all child accounts
export const getAllChildAccounts = async (req, res, next) => {
  try {
    const childAccounts = await ChartOfAccount.find({
      parentAccount: { $exists: true, $not: { $size: 0 } }, // Find accounts with non-empty parentAccount array
      isDeleted: { $ne: true },
    })
      .populate({
        path: "parentAccount",
      })
      .populate({
        path: "subAccounts",
        populate: { path: "parentAccount" }, // Populate parentAccount of each subAccount
      });

    // Recursively populate parentAccount for each subAccount
    const populatedChildAccounts = await Promise.all(
      childAccounts.map(async (account) => {
        if (account.subAccounts && account.subAccounts.length > 0) {
          account.subAccounts = await Promise.all(
            account.subAccounts.map(async (subAccount) => {
              return await ChartOfAccount.findById(subAccount._id)
                .populate("parentAccount")
                .populate("subAccounts");
            })
          );
        }
        return account;
      })
    );

    res.status(200).json({
      success: true,
      data: populatedChildAccounts,
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

      if (!account?.parentAccount || account.parentAccount.length === 0) {
        delete account.parentAccount;
      }

      // Validate each parentAccount ID
      if (account.parentAccount) {
        const areParentAccountsValid = account.parentAccount.every((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );

        if (!areParentAccountsValid) {
          return res.status(400).json({
            success: false,
            message: "Invalid parent account IDs",
          });
        }

        // Check if all parent accounts exist and are not deleted
        const parentAccounts = await ChartOfAccount.find({
          _id: { $in: account.parentAccount },
          isDeleted: { $ne: true },
        });

        if (parentAccounts.length !== account.parentAccount.length) {
          return res.status(400).json({
            success: false,
            message: "One or more parent accounts do not exist or are deleted",
          });
        }
      }

      const existingAccount = await isAccountCodeExisting(account);

      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: "Account code already exists",
        });
      }

      // Create the new account
      let newAccount = await ChartOfAccount.create(account);
      newAccount = await newAccount.populate("parentAccount");

      // Check if any parentAccount is deleted
      if (newAccount.parentAccount) {
        newAccount.parentAccount = newAccount.parentAccount.filter(
          (parent) => !parent.isDeleted
        );
      }

      // Update the parentAccount field of subAccounts to the new account ID
      if (newAccount.subAccounts && newAccount.subAccounts.length > 0) {
        await ChartOfAccount.updateMany(
          { _id: { $in: newAccount.subAccounts } },
          { parentAccount: newAccount._id },
          { new: true, runValidators: true }
        );
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
    })
      .populate({
        path: "parentAccount",
      })
      .populate({
        path: "subAccounts",
        populate: { path: "parentAccount" }, // Populate parentAccount of each subAccount
      });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Recursively populate parentAccount for each subAccount
    if (account.subAccounts && account.subAccounts.length > 0) {
      account.subAccounts = await Promise.all(
        account.subAccounts.map(async (subAccount) => {
          return await ChartOfAccount.findById(subAccount._id)
            .populate("parentAccount")
            .populate("subAccounts");
        })
      );
    }

    // Filter out deleted parent accounts if parentAccount is an array
    if (account.parentAccount && Array.isArray(account.parentAccount)) {
      account.parentAccount = account.parentAccount.filter(
        (parent) => !parent.isDeleted
      );
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

    // Validate parentAccount if it exists
    if (account.parentAccount) {
      const areParentAccountsValid = account.parentAccount.every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );

      if (!areParentAccountsValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent account IDs",
        });
      }

      // Check if all parent accounts exist and are not deleted
      const parentAccounts = await ChartOfAccount.find({
        _id: { $in: account.parentAccount },
        isDeleted: { $ne: true },
      });

      if (parentAccounts.length !== account.parentAccount.length) {
        return res.status(400).json({
          success: false,
          message: "One or more parent accounts do not exist or are deleted",
        });
      }
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
    )
      .populate("parentAccount")
      .populate("subAccounts");

    if (!updatedAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Filter out deleted parent accounts if parentAccount is an array
    if (
      updatedAccount.parentAccount &&
      Array.isArray(updatedAccount.parentAccount)
    ) {
      updatedAccount.parentAccount = updatedAccount.parentAccount.filter(
        (parent) => !parent.isDeleted
      );
    }

    // Add new parentAccount to the subAccounts but avoid adding the same account to itself, assuming the parentAccount is an array of ids
    if (updatedAccount.subAccounts && updatedAccount.subAccounts.length > 0) {
      await Promise.all(
        updatedAccount.subAccounts.map(async (subAccountId) => {
          const subAccount = await ChartOfAccount.findById(subAccountId);

          if (subAccount) {
            // Ensure the parentAccount array exists
            if (!Array.isArray(subAccount.parentAccount)) {
              subAccount.parentAccount = [];
            }

            // Avoid adding the same account to itself
            if (
              !subAccount.parentAccount.includes(updatedAccount._id.toString())
            ) {
              subAccount.parentAccount.push(updatedAccount._id);
              await subAccount.save();
            }
          }
        })
      );
    }

    res.status(200).json({
      success: true,
      data: updatedAccount,
    });
  } catch (error) {
    next(error);
  }
};

export const addChildAccount = async (req, res, next) => {
    try {
      const { parentAccountId } = req.params;

      // validate parentAccountId
      if (!mongoose.Types.ObjectId.isValid(parentAccountId)) {
        return res.status(404).json({
          success: false,
          message: "Parent account not found",
        });
      }

      // create child account
      const account = { ...req.body };

      // Remove restricted fields
      delete account.isDeleted;
      delete account.deletedAt;

      // Check if the parent account exists and is not deleted
      const parentAccount = await ChartOfAccount.findOne({
        _id: parentAccountId,
        isDeleted: { $ne: true },
      });

      if (!parentAccount) {
        return res.status(404).json({
          success: false,
          message: "Parent account not found",
        });
      }

      // Check if the account code already exists
      const existingAccount = await isAccountCodeExisting(account);
      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: "Account code already exists",
        });
      }

      // Create the new child account
      const accountData = {
        ...account,
        // add the parentAccount ID to the array without overwriting it
        parentAccount: [...(account.parentAccount || []), parentAccountId],
      };
      let newAccount = await ChartOfAccount.create(accountData);

      // Add the new child account to the parent's subAccounts array
      if (!Array.isArray(parentAccount.subAccounts)) {
        parentAccount.subAccounts = [];
      }

      if (!parentAccount.subAccounts.includes(newAccount._id.toString())) {
        parentAccount.subAccounts.push(newAccount._id);
        await parentAccount.save();
      }

      res.status(201).json({
        success: true,
        data: newAccount,
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

export const deleteAllAccountsPermanently = async (req, res, next) => {
    try {
      // Delete all accounts permanently
      const result = await ChartOfAccount.deleteMany({});

      res.status(200).json({
        success: true,
        message: `${result.deletedCount} accounts permanently deleted.`,
      });
    } catch (error) {
        next(error);
    }
};