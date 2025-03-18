import mongoose from "mongoose";

const branchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Branch Name is required"],
      maxlength: [255, "Branch Name cannot exceed 255 characters"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    tin: {
      type: String,
      required: [true, "TIN is required"],
      maxlength: [20, "TIN cannot exceed 20 characters"],
      trim: true,
    },
    machineId: {
      type: String,
      // required: [true, "Machine ID is required"],
      maxlength: [50, "Machine ID cannot exceed 50 characters"],
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

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;