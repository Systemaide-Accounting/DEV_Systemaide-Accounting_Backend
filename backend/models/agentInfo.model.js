import mongoose from "mongoose";

const agentInfoSchema = mongoose.Schema(
  {
    agentCode: {
      type: String,
      required: [true, "Agent code is required"],
      maxlength: [50, "Agent code cannot exceed 50 characters"],
      trim: true,
    },
    tin: {
      type: String,
      required: [true, "TIN is required"],
      maxlength: [255, "TIN cannot exceed 20 characters"],
      trim: true,
    },
    taxClassification: {
      type: String,
      required: [true, "Tax classification is required"],
      enum: ["individual", "non-individual"],
      // default: "individual",
      maxlength: [50, "Tax classification cannot exceed 50 characters"],
      trim: true,
    },
    registeredName: {
      type: String,
      required: [true, "Registered name is required"],
      maxlength: [255, "Registered name cannot exceed 255 characters"],
      trim: true,
    },
    agentName: {
      type: String,
      maxlength: [255, "Agent name cannot exceed 255 characters"],
      required: [true, "Agent name is required"],
      trim: true,
    },
    tradeName: {
      type: String,
      maxlength: [255, "Trade name cannot exceed 255 characters"],
      required: [true, "Trade name is required"],
      trim: true,
    },
    agentType: {
      type: String,
      required: [true, "Agent type is required"],
      enum: ["customer", "supplier", "government-agency", "employee", "others"],
      // default: "customer",
      maxlength: [50, "Agent type cannot exceed 50 characters"],
      trim: true,
    },
    registrationType: {
      type: String,
      required: [true, "Registration type is required"],
      enum: ["vat", "non-vat"],
      // default: "vat",
      maxlength: [50, "Registration type cannot exceed 50 characters"],
      trim: true,
    },
    authorizedRepresentative: {
      type: String,
      // required: [true, "Authorized representative is required"],
      // maxlength: [255,"Authorized representative cannot exceed 255 characters",],
      trim: true,
    },
    agentAddress: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    email: {
      type: String,
      // required: [true, "Email is required"],
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      // required: [true, "Phone is required"],
      // maxlength: [50, "Phone cannot exceed 50 characters"],
      trim: true,
    },
    fax: {
      type: String,
      // required: [true, "Fax is required"],
      // maxlength: [50, "Fax cannot exceed 50 characters"],
      trim: true,
    },
    website: {
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

const AgentInfo = mongoose.model("AgentInfo", agentInfoSchema);

export default AgentInfo;