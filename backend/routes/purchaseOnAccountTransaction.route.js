import express from 'express';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import {
  createPurchaseOnAccountTransaction,
  deletePurchaseOnAccountTransaction,
  getAllPurchaseOnAccountTransactions,
  getPurchaseOnAccountTransactionById,
  updatePurchaseOnAccountTransaction
} from '../controllers/purchaseOnAccountTransaction.controller.js';
import {
  hasViewAllTransactions,
  hasCreateTransaction,
  hasUpdateTransaction,
  hasDeleteTransaction,
  hasViewTransactionById,
} from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", isAuthorized, hasViewAllTransactions, getAllPurchaseOnAccountTransactions);
router.post("/", isAuthorized, hasCreateTransaction, createPurchaseOnAccountTransaction);
router.get("/:id", isAuthorized, hasViewTransactionById, getPurchaseOnAccountTransactionById);
router.patch("/:id", isAuthorized, hasUpdateTransaction, updatePurchaseOnAccountTransaction);
router.delete("/delete/:id", isAuthorized, hasDeleteTransaction, deletePurchaseOnAccountTransaction);

export default router;
