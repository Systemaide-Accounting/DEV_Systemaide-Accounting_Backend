import express from "express";
import {
  isAdmin,
  isAuthorized,
  isRegular,
  isSysAdmin,
} from "../middlewares/auth.middleware.js";
import { createAccount, deleteAccount, getAccountById, getAllAccounts, updateAccount } from "../controllers/chartOfAccount.controller.js";

const router = express.Router();

router.get("/", isAuthorized, isSysAdmin, getAllAccounts);
router.get("/:id", isAuthorized, isSysAdmin, getAccountById);
router.post("/", isAuthorized, isSysAdmin, createAccount);
router.patch("/:id", isAuthorized, isSysAdmin, updateAccount);
router.patch("/delete/:id", isAuthorized, isSysAdmin, deleteAccount);

export default router;