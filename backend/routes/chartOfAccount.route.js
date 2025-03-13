import express from "express";
import {
  isAdmin,
  isAuthorized,
  isRegular,
  isSysAdmin,
} from "../middlewares/auth.middleware.js";
import { createAccount, deleteAccount, getAccountById, getAllAccounts, updateAccount } from "../controllers/chartOfAccount.controller.js";
import { hasCreateAccount, hasDeleteAccount, hasUpdateAccount, hasViewAccountById, hasViewAllAccounts } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", isAuthorized, hasViewAllAccounts, getAllAccounts);
router.get("/:id", isAuthorized, hasViewAccountById, getAccountById);
router.post("/", isAuthorized, hasCreateAccount, createAccount);
router.patch("/:id", isAuthorized, hasUpdateAccount, updateAccount);
router.patch("/delete/:id", isAuthorized, hasDeleteAccount, deleteAccount);

export default router;