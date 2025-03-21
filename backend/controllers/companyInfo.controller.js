import CompanyInfo from "../models/companyInfo.model.js";
import mongoose from "mongoose";

// Check for existing company with the same TIN but is not deleted
const isCompanyTINExisting = async (company) => {
  const existingCompany = await CompanyInfo.findOne({
    tin: company?.tin,
    isDeleted: { $ne: true },
  });
  return existingCompany;
};

// get first 1 company
export const getLatestCompany = async (req, res, next) => {
  try {
    const companyInfo = await CompanyInfo.findOne({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(1);

    // if (!companyInfo) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No company found",
    //   });
    // }

    res.status(200).json({
      success: true,
      data: companyInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCompanies = async (req, res, next) => {
 try {
    const companyInfos = await CompanyInfo.find({ isDeleted: { $ne: true } });
    res.status(200).json({
      success: true,
      data: companyInfos,
    });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req, res, next) => {
    try {
      const company = { ...req.body };

      // Remove restricted fields
      delete company.isDeleted;
      delete company.deletedAt;

      const existingCompany = await isCompanyTINExisting(company);

      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: "Company TIN already exists",
        });
      }

      const newCompany = await CompanyInfo.create(company);

      res.status(201).json({
        success: true,
        data: newCompany,
      });
    } catch (error) {
        next(error);
    }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id: companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const company = await CompanyInfo.findOne({
      _id: companyId,
      isDeleted: { $ne: true },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { id: companyId } = req.params;
    const company = { ...req.body }; // Clone the object to avoid modifying the original

    // Remove restricted fields
    delete company.isDeleted;
    delete company.deletedAt;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Check for existing company with the same TIN, excluding the current company, and is not soft deleted
    const existingCompany = await CompanyInfo.findOne({
      tin: company?.tin,
      _id: { $ne: companyId },
      isDeleted: { $ne: true },
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company with the same TIN already exists",
      });
    }

    const updatedCompany = await CompanyInfo.findOneAndUpdate(
      { _id: companyId, isDeleted: { $ne: true } },
      company,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCompany,
    });
  } catch (error) {
    next(error);
  }
};

// this is soft delete only
export const deleteCompany = async (req, res, next) => {
    try {
        const { id: companyId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        // update the isDeleted to true and deletedAt to date today
        const deletedCompany = await CompanyInfo.findOneAndUpdate(
          { _id: companyId, isDeleted: { $ne: true } }, //filter
          { isDeleted: true, deletedAt: new Date() }, //update
          { new: true, runValidators: true }
        );

        if (!deletedCompany) {
            return res.status(404).json({
              success: false,
              message: "Company not found",
            });
        }

        res.status(200).json({
          success: true,
          data: deletedCompany,
        });
    } catch (error) {
        next(error);
    }
};