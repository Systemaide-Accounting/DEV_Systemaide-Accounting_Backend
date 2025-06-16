import express from 'express';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { createPurchaseOnAccountTransaction, deletePurchaseOnAccountTransaction, getAllPurchaseOnAccountTransactions, getPurchaseOnAccountTransactionById, updatePurchaseOnAccountTransaction, restorePurchaseOnAccountTransaction, getAllDeletedPurchaseOnAccountTransactions } from '../controllers/purchaseOnAccountTransaction.controller.js';
import { hasViewAllTransactions, hasCreateTransaction, hasUpdateTransaction, hasDeleteTransaction, hasViewTransactionById, hasRestoreTransaction} from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/deleted", isAuthorized, hasRestoreTransaction, getAllDeletedPurchaseOnAccountTransactions);

router.get("/", isAuthorized, hasViewAllTransactions, getAllPurchaseOnAccountTransactions);
router.post("/", isAuthorized, hasCreateTransaction, createPurchaseOnAccountTransaction);
router.get("/:id", isAuthorized, hasViewTransactionById, getPurchaseOnAccountTransactionById);
router.patch("/:id", isAuthorized, hasUpdateTransaction, updatePurchaseOnAccountTransaction);
router.delete("/:id", isAuthorized, hasDeleteTransaction, deletePurchaseOnAccountTransaction);
router.patch("/restore/:id", isAuthorized, hasRestoreTransaction, restorePurchaseOnAccountTransaction);

export default router;
