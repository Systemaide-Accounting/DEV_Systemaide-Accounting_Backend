import express from 'express';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { createSalesOnAccount, getAllSalesOnAccount, getSalesOnAccountById, updateSalesOnAccount, deleteSalesOnAccount, restoreSalesOnAccount, getAllDeletedSalesOnAccount } from '../controllers/salesOnAccount.controller.js';
import { hasViewAllTransactions, hasCreateTransaction, hasUpdateTransaction, hasDeleteTransaction, hasViewTransactionById, hasRestoreTransaction } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/deleted", isAuthorized, hasRestoreTransaction, getAllDeletedSalesOnAccount);

router.get("/", isAuthorized, hasViewAllTransactions, getAllSalesOnAccount);
router.post("/", isAuthorized, hasCreateTransaction, createSalesOnAccount);
router.get("/:id", isAuthorized, hasViewTransactionById, getSalesOnAccountById);
router.patch("/:id", isAuthorized, hasUpdateTransaction, updateSalesOnAccount);
router.delete("/:id", isAuthorized, hasDeleteTransaction, deleteSalesOnAccount);
router.patch("/restore/:id", isAuthorized, hasRestoreTransaction, restoreSalesOnAccount);

export default router;
