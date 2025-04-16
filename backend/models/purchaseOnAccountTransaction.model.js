import mongoose from "mongoose";

const purchaseOnAccountTransactionSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Location is required"],
    },
    pvNo: {
      type: String,
      required: [true, "PV No is required"],
      maxlength: [50, "PV No cannot exceed 50 characters"],
      trim: true,
    },
    supplierName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentInfo",
      required: [true, "Supplier Name is required"],
    },
    address: {
      type: String,
      maxlength: [255, "Address cannot exceed 255 characters"],
      trim: true,
    },
    tin: {
      type: String,
      maxlength: [255, "TIN cannot exceed 255 characters"],
      trim: true,
    },
    particular: {
      type: String,
      required: [true, "Particular is required"],
      maxlength: [255, "Particular cannot exceed 255 characters"],
      trim: true,
    },

    // B. Transaction Template
    purchaseType: {
      type: String,
      required: [true, "Purchase Type is required"],
      enum: ["12% VAT", "Zero-Rated", "VAT Exempt", "Non-VAT"],
    },
    inventoryAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChartOfAccount",
      required: [true, "Inventory Account is required"],
    },
    grossAmount: {
      type: Number,
      required: [true, "Gross Amount is required"],
      min: [0, "Gross Amount cannot be negative"],
    },
    netAmount: {
      type: Number,
      min: [0, "Net Amount cannot be negative"],
    },
    inputTax: {
      type: Number,
      min: [0, "Input Tax cannot be negative"],
      default: 0,
    },
    withholdingTax: {
      type: Number,
      min: [0, "Withholding Tax cannot be negative"],
      default: 0,
    },
    atcCode: {
      type: String,
      maxlength: [50, "ATC Code cannot exceed 50 characters"],
      trim: true,
    },

    // System/Soft Delete Fields
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

const PurchaseOnAccountTransaction = mongoose.model(
  "PurchaseOnAccountTransaction",
  purchaseOnAccountTransactionSchema
);



export default PurchaseOnAccountTransaction;
