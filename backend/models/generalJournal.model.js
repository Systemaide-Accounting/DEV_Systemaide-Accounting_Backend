import mongoose from "mongoose";

const generalJournalSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: [true, "Date is required"],
            trim: true,
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
            // required: [true, "Location is required"],
            trim: true,
        },
        jvNo: {
            type: String,
            required: [true, "JV No is required"],
            maxlength: [50, "JV No cannot exceed 50 characters"],
            trim: true,
        },
        particular: {
            type: String,
            required: [true, "Particular is required"],
            // maxlength: [255, "Particular cannot exceed 255 characters"],
            trim: true,
        },
        totalDebit: {
            type: String,
            // required: [true, "Total Debit is required"],
            trim: true,
        },
        totalCredit: {
            type: String,
            // required: [true, "Total Credit is required"],
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
        restoredAt: {
			type: Date,
		},
    },
    {
        timestamps: true,
    }
);

const GeneralJournal = mongoose.model("GeneralJournal", generalJournalSchema);
export default GeneralJournal;
