import mongoose from "mongoose";

const chartOfAccountSchema = mongoose.Schema(
  {
    accountCode: {
      type: String,
      required: [true, "Account code is required"],
      maxlength: [20, "Account code cannot exceed 20 characters"],
      trim: true,
    },
    accountName: {
      type: String,
      required: [true, "Account name is required"],
      maxlength: [255, "Account name cannot exceed 255 characters"],
      trim: true,
    },
    accountType: {
      type: String,
      // required: [true, "Account type is required"],
      enum: ["", "asset", "liability", "equity", "revenue", "expense"],
      trim: true,
    },
    normalBalance: {
      type: String,
      // required: [true, "Normal balance is required"],
      enum: ["", "debit", "credit"],
      trim: true,
    },
    parentAccount: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChartOfAccount",
        trim: true,
      }
  ],
    subAccounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChartOfAccount",
        trim: true,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    restoredAt: {
			type: Date,
		},
  },
  {
    timestamps: true,
  }
);

const ChartOfAccount = mongoose.model("ChartOfAccount", chartOfAccountSchema);

export default ChartOfAccount;