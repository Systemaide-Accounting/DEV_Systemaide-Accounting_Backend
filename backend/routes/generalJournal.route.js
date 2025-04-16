import express from 'express';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { createGeneralJournal, deleteGeneralJournal, getAllGeneralJournal, getGeneralJournalById, updateGeneralJournal } from '../controllers/generalJournal.controller.js';
import { hasViewAllTransactions, hasCreateTransaction, hasUpdateTransaction, hasDeleteTransaction, hasViewTransactionById } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", isAuthorized, hasViewAllTransactions, getAllGeneralJournal);
router.post("/", isAuthorized, hasCreateTransaction, createGeneralJournal);
router.get("/:id", isAuthorized, hasViewTransactionById, getGeneralJournalById);
router.patch("/:id", isAuthorized, hasUpdateTransaction, updateGeneralJournal);
router.delete("/delete/:id", isAuthorized, hasDeleteTransaction, deleteGeneralJournal);

export default router;