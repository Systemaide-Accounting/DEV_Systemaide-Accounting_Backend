import express from 'express';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { createCashDisbursementTransaction, deleteCashDisbursementTransaction, getAllCashDisbursementTransactions, getCashDisbursementTransactionById, updateCashDisbursementTransaction, restoreCashDisbursementTransaction } from '../controllers/cashDisbursementTransaction.controller.js';
import { hasViewAllTransactions, hasCreateTransaction, hasUpdateTransaction, hasDeleteTransaction, hasViewTransactionById, hasRestoreTransaction} from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", isAuthorized, hasViewAllTransactions, getAllCashDisbursementTransactions);
router.post("/", isAuthorized, hasCreateTransaction, createCashDisbursementTransaction);
router.get("/:id", isAuthorized, hasViewTransactionById, getCashDisbursementTransactionById);
router.patch("/:id", isAuthorized, hasUpdateTransaction, updateCashDisbursementTransaction);
router.delete("/delete/:id", isAuthorized, hasDeleteTransaction, deleteCashDisbursementTransaction);
router.patch("/restore/:id", isAuthorized, hasRestoreTransaction, restoreCashDisbursementTransaction);

export default router;