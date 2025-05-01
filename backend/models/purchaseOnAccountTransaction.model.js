import mongoose from "mongoose";

const purchaseOnAccountTransactionSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    month: {
      type: String,
      // required: [true, "Month is required"],
      trim: true,
    },
    year: {
      type: String,
      // required: [true, "Year is required"],
      trim: true,
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
    invoiceNo: {
      type: String,
      required: [true, "Invoice No is required"],
      maxlength: [50, "Invoice No cannot exceed 50 characters"],
      trim: true,
    },
    supplierName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentInfo",
      required: [true, "Supplier Name is required"],
    },
    address: {
      // value based on supplier name or agent
      type: String,
      maxlength: [255, "Address cannot exceed 255 characters"],
      trim: true,
    },
    tin: {
      // value based on supplier name or agent
      type: String,
      maxlength: [255, "TIN cannot exceed 255 characters"],
      trim: true,
    },
    particular: {
      type: String,
      required: [true, "Particular is required"],
      // maxlength: [255, "Particular cannot exceed 255 characters"],
      trim: true,
    },

    // B. Transaction Template
		transactionLines: {
			type: String,
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
