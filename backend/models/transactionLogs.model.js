import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
	{
		transaction: {
			type: String,
			required: true,
			enum: [
				"CashDisbursementTransaction",
				"CashReceiptsTransaction",
				"SalesOnAccount",
				"PurchaseOnAccountTransaction",
				"GeneralJournal",
			],
		},
		transactionId: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "transaction", // Dynamically reference a collection based on the `transaction` field
			required: true,
		},
		action: {
			type: String,
			enum: ["CREATE", "UPDATE", "DELETE", "RESTORE"],
			required: true,
		},
		remarks: {
			type: String,
			default: "",
		},
		remarks_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Adjust to your user collection name
			required: true,
		},
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

const TransactionLog = mongoose.model("TransactionLog", logSchema);

export default TransactionLog;
