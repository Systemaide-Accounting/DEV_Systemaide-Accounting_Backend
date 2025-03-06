import mongoose from "mongoose";

const companyInfoSchema = mongoose.Schema(
  {
    tin: {
      type: String,
      required: [true, "TIN is required"],
      maxlength: [20, "TIN cannot exceed 20 characters"],
      trim: true,
    },
    taxClassification: {
      type: String,
      required: [true, "Tax classification is required"],
      enum: ["individual", "non-individual"], 
      maxlength: [50, "Tax classification cannot exceed 50 characters"],
      trim: true,
    },
    registeredName: {
      type: String,
      required: [true, "Registered name is required"],
      maxlength: [255, "Registered name cannot exceed 255 characters"],
      trim: true,
    },
    businessAddress: {
      type: String,
      required: [true, "Business address is required"],
      trim: true,
    },
    rdo: {
      type: String,
      required: [true, "RDO is required"],
      maxlength: [10, "RDO cannot exceed 10 characters"],
      trim: true,
    },
    fiscalYear: {
      type: String,
      // match: [/^\d{4}-\d{4}$/, "Fiscal year must be in the format YYYY-YYYY"],
      validate: {
        validator: function (v) {
          if (!/^\d{4}-\d{4}$/.test(v)) {
            return false; // Invalid format
          }
          const [startYear, endYear] = v.split("-").map(Number);
          return endYear > startYear; // End year must be greater than start year
        },
        message: (props) =>
          `${props.value} is not a valid fiscal year! End year must be greater than start year and the format should be YYYY-YYYY`,
      },
      required: [true, "Fiscal year is required"],
      maxlength: [10, "Fiscal year cannot exceed 10 characters"],
      trim: true,
    },
    businessType: {
      type: String,
      enum: ["corporation"], // this can be added
      // default: "corporation",
      required: [true, "Business type is required"],
      trim: true,
    },
    lineOfBusiness: {
      type: String,
      required: [true, "Line of business is required"],
      maxlength: [100, "Line of business cannot exceed 100 characters"],
      trim: true,
    },
    telephoneFax: {
      type: String,
      required: [true, "Telephone/Fax is required"],
      maxlength: [50, "Telephone/Fax cannot exceed 50 characters"],
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

const CompanyInfo = mongoose.model("CompanyInfo", companyInfoSchema);

export default CompanyInfo;