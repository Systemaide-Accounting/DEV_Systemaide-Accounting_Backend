import express from 'express';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { createCashReceiptsTransaction, deleteCashReceiptsTransaction, getAllCashReceiptsTransaction, getCashReceiptsTransactionById, updateCashReceiptsTransaction, restoreCashReceiptsTransaction, getAllDeletedCashReceiptsTransactions } from '../controllers/cashReceiptsTransaction.controller.js';
import { hasViewAllTransactions, hasCreateTransaction, hasUpdateTransaction, hasDeleteTransaction, hasViewTransactionById, hasRestoreTransaction } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/deleted", isAuthorized, hasRestoreTransaction, getAllDeletedCashReceiptsTransactions);

router.get("/", isAuthorized, hasViewAllTransactions, getAllCashReceiptsTransaction);
router.post("/", isAuthorized, hasCreateTransaction, createCashReceiptsTransaction);
router.get("/:id", isAuthorized, hasViewTransactionById, getCashReceiptsTransactionById);
router.patch("/:id", isAuthorized, hasUpdateTransaction, updateCashReceiptsTransaction);
router.delete("/:id", isAuthorized, hasDeleteTransaction, deleteCashReceiptsTransaction);
router.patch("/restore/:id", isAuthorized, hasRestoreTransaction, restoreCashReceiptsTransaction);

export default router;
