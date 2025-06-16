import express from 'express';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { createGeneralJournal, deleteGeneralJournal, getAllGeneralJournal, getGeneralJournalById, updateGeneralJournal, restoreGeneralJournal, getAllDeletedGeneralJournal } from '../controllers/generalJournal.controller.js';
import { hasViewAllTransactions, hasCreateTransaction, hasUpdateTransaction, hasDeleteTransaction, hasViewTransactionById, hasRestoreTransaction } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/deleted", isAuthorized, hasRestoreTransaction, getAllDeletedGeneralJournal);

router.get("/", isAuthorized, hasViewAllTransactions, getAllGeneralJournal);
router.post("/", isAuthorized, hasCreateTransaction, createGeneralJournal);
router.get("/:id", isAuthorized, hasViewTransactionById, getGeneralJournalById);
router.patch("/:id", isAuthorized, hasUpdateTransaction, updateGeneralJournal);
router.delete("/:id", isAuthorized, hasDeleteTransaction, deleteGeneralJournal);
router.patch("/restore/:id", isAuthorized, hasRestoreTransaction, restoreGeneralJournal);

export default router;