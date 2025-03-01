import express from "express";
import {
  isAdmin,
  isAuthorized,
  isRegular,
  isSysAdmin,
} from "../middlewares/auth.middleware.js";
import { createCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controllers/companyInfo.controller.js";

const router = express.Router();

router.get("/", isAuthorized, isSysAdmin, getAllCompanies);
router.post("/", isAuthorized, isSysAdmin, createCompany);
router.get("/:id", isAuthorized, isSysAdmin, getCompanyById);
router.patch("/:id", isAuthorized, isSysAdmin, updateCompany);
router.patch("/delete/:id", isAuthorized, isSysAdmin, deleteCompany);

export default router;