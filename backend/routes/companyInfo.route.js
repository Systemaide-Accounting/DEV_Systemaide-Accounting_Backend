import express from "express";
import {
  isAdmin,
  isAuthorized,
  isRegular,
  isSysAdmin,
} from "../middlewares/auth.middleware.js";
import { createCompany, deleteCompany, getAllCompanies, getCompanyById, getLatestCompany, updateCompany } from "../controllers/companyInfo.controller.js";
import { hasCreateCompany, hasDeleteCompany, hasUpdateCompany, hasViewAllCompanies, hasViewCompanyById } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/latest", isAuthorized, hasViewAllCompanies, getLatestCompany);
router.get("/", isAuthorized, hasViewAllCompanies, getAllCompanies);
router.post("/", isAuthorized, hasCreateCompany, createCompany);
router.get("/:id", isAuthorized, hasViewCompanyById, getCompanyById);
router.patch("/:id", isAuthorized, hasUpdateCompany, updateCompany);
router.delete("/delete/:id", isAuthorized, hasDeleteCompany, deleteCompany);

export default router;