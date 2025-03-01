import mongoose from "mongoose";

const agentInfoSchema = mongoose.Schema(
  {
    tin: {
      type: String,
      required: [true, "TIN is required"],
      unique: true,
      maxlength: [20, "TIN cannot exceed 20 characters"],
      trim: true,
    },
    taxClassification: {
      type: String,
      required: [true, "Tax classification is required"],
      maxlength: [50, "Tax classification cannot exceed 50 characters"],
      trim: true,
    },
    registeredName: {
      type: String,
      required: [true, "Registered name is required"],
      maxlength: [255, "Registered name cannot exceed 255 characters"],
      trim: true,
    },
    agentType: {
      type: String,
      required: [true, "Agent type is required"],
      maxlength: [50, "Agent type cannot exceed 50 characters"],
      trim: true,
    },
    registrationType: {
      type: String,
      required: [true, "Registration type is required"],
      maxlength: [50, "Registration type cannot exceed 50 characters"],
      trim: true,
    },
    authorizedRepresentative: {
      type: String,
      required: [true, "Authorized representative is required"],
      maxlength: [
        255,
        "Authorized representative cannot exceed 255 characters",
      ],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      maxlength: [50, "Phone cannot exceed 50 characters"],
      trim: true,
    },
    fax: {
      type: String,
      required: [true, "Fax is required"],
      maxlength: [50, "Fax cannot exceed 50 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const AgentInfo = mongoose.model("AgentInfo", agentInfoSchema);

export default AgentInfo;