import express from 'express';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { createCashReceiptsTransaction, deleteCashReceiptsTransaction, getAllCashReceiptsTransaction, getCashReceiptsTransactionById, updateCashReceiptsTransaction } from '../controllers/cashReceiptsTransaction.controller.js';
import { hasViewAllTransactions, hasCreateTransaction, hasUpdateTransaction, hasDeleteTransaction, hasViewTransactionById } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", isAuthorized, hasViewAllTransactions, getAllCashReceiptsTransaction);
router.post("/", isAuthorized, hasCreateTransaction, createCashReceiptsTransaction);
router.get("/:id", isAuthorized, hasViewTransactionById, getCashReceiptsTransactionById);
router.patch("/:id", isAuthorized, hasUpdateTransaction, updateCashReceiptsTransaction);
router.delete("/delete/:id", isAuthorized, hasDeleteTransaction, deleteCashReceiptsTransaction);

export default router;
