import express from "express";
import {
  isAdmin,
  isAuthorized,
  isRegular,
  isSysAdmin,
} from "../middlewares/auth.middleware.js";
import {
  createAccount,
  deleteAccount,
  getAccountById,
  getAllAccounts,
  getAllParentAccounts,
  getChildAccounts,
  updateAccount,
  deleteAllAccountsPermanently,
  getAllChildAccounts,
  addChildAccount,
} from "../controllers/chartOfAccount.controller.js";
import { hasCreateAccount, hasDeleteAccount, hasUpdateAccount, hasViewAccountById, hasViewAllAccounts } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/accounts/parent", isAuthorized, hasViewAllAccounts, getAllParentAccounts);
router.get("/accounts/child", isAuthorized, hasViewAllAccounts, getAllChildAccounts);
router.get("/accounts/:id/child", isAuthorized, hasViewAllAccounts, getChildAccounts);
router.post("/:parentAccountId/child", isAuthorized, hasCreateAccount, addChildAccount);

router.get("/", isAuthorized, hasViewAllAccounts, getAllAccounts);
router.get("/:id", isAuthorized, hasViewAccountById, getAccountById);
router.post("/", isAuthorized, hasCreateAccount, createAccount);
router.patch("/:id", isAuthorized, hasUpdateAccount, updateAccount);
router.patch("/delete/:id", isAuthorized, hasDeleteAccount, deleteAccount);
router.delete("/delete/all", isAuthorized, hasDeleteAccount, deleteAllAccountsPermanently);

export default router;