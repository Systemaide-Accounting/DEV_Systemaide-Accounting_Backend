import mongoose from "mongoose";

const locationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Location Name is required"],
      maxlength: [255, "Location Name cannot exceed 255 characters"],
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
    branch: {
      type: String,
      // required: [true, "Branch is required"],
      // maxlength: [50, "Branch cannot exceed 50 characters"],
      enum: ["", "main"],
      default: "",
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

const Location = mongoose.model("Location", locationSchema);

export default Location;