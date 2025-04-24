import express from "express";
import { isAuthorized } from "../middlewares/auth.middleware.js";
import { getCashDisbursementTransactionReport, getCashReceiptsTransactionReport, getSalesOnAccountReport, getGeneralJournalReport, getPurchaseOnAccountReport } from "../controllers/report.controller.js";
import { hasViewJournalReport } from "../middlewares/permission.middleware.js";
const router = express.Router();

router.post( "/cash-disbursement", isAuthorized, hasViewJournalReport, getCashDisbursementTransactionReport );
router.post( "/cash-receipts", isAuthorized, hasViewJournalReport, getCashReceiptsTransactionReport );
router.post( "/sales-on-account", isAuthorized, hasViewJournalReport, getSalesOnAccountReport );
router.post( "/purchase-on-account", isAuthorized, hasViewJournalReport, getPurchaseOnAccountReport );
router.post( "/general-journal", isAuthorized, hasViewJournalReport, getGeneralJournalReport);

export default router;
