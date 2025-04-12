import mongoose from "mongoose";

const CashReceiptsTransactionSchema = mongoose.Schema(
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
    orNo: {
      type: String,
      required: [true, "OR No is required"],
      maxlength: [50, "OR No cannot exceed 50 characters"],
      trim: true,
    },
    payorName: {
      type: String,
      required: [true, "Payor Name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      maxlength: [255, "Address cannot exceed 255 characters"],
      trim: true,
    },
    tin: {
      type: String,
      required: [true, "Tin is required"],
      maxlength: [255, "Tin cannot exceed 255 characters"],
      trim: true,
    },
    cashAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChartOfAccount",
      required: [true, "Cash Account is required"],
      trim: true,
    },
    cashAmount: {
      type: String,
      required: [true, "Cash Amount is required"],
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

const CashReceiptsTransaction = mongoose.model("CashReceiptsTransaction", CashReceiptsTransactionSchema);

export default CashReceiptsTransaction;