import mongoose from "mongoose";

const SalesOnAccountSchema = mongoose.Schema(
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
		invoiceNo: {
			type: String,
			required: [true, "Invoice No is required"],
			maxlength: [50, "Invoice No cannot exceed 50 characters"],
			trim: true,
		},
		customerName: {
			type: String,
			required: [true, "Customer Name is required"],
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

const SalesOnAccount = mongoose.model("SalesOnAccount", SalesOnAccountSchema);

export default SalesOnAccount;
