import express from 'express';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { createSalesOnAccount, getAllSalesOnAccount, getSalesOnAccountById, updateSalesOnAccount, deleteSalesOnAccount } from '../controllers/salesOnAccount.controller.js';
import { hasViewAllTransactions, hasCreateTransaction, hasUpdateTransaction, hasDeleteTransaction, hasViewTransactionById } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", isAuthorized, hasViewAllTransactions, getAllSalesOnAccount);
router.post("/", isAuthorized, hasCreateTransaction, createSalesOnAccount);
router.get("/:id", isAuthorized, hasViewTransactionById, getSalesOnAccountById);
router.patch("/:id", isAuthorized, hasUpdateTransaction, updateSalesOnAccount);
router.delete("/delete/:id", isAuthorized, hasDeleteTransaction, deleteSalesOnAccount);

export default router;
