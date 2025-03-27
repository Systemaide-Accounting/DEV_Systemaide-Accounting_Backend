import mongoose from "mongoose";

const cashDisbursementTransactionSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      trim: true,
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Location is required"],
      trim: true,
    },
    cvNo: {
      type: String,
      required: [true, "CV No is required"],
      maxlength: [50, "CV No cannot exceed 50 characters"],
      trim: true,
    },
    checkNo: {
      type: String,
      required: [true, "Check No is required"],
      // maxlength: [50, "Check No cannot exceed 50 characters"],
      trim: true,
    },
    payeeName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentInfo",
      required: [true, "Payee Name is required"],
      trim: true,
    },
    addressTIN: {
      type: String,
      required: [true, "Address/TIN is required"],
      maxlength: [255, "Address/TIN cannot exceed 255 characters"],
      trim: true,
    },
    cashAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChartOfAccount",
      required: [true, "Cash Account is required"],
      trim: true,
    },
    particular: {
      type: String,
      required: [true, "Particular is required"],
      maxlength: [255, "Particular cannot exceed 255 characters"],
      trim: true,
    },
    transactionLines: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const CashDisbursementTransaction = mongoose.model("CashDisbursementTransaction", cashDisbursementTransactionSchema);

export default CashDisbursementTransaction;