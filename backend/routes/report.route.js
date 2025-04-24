import express from "express";
import { isAuthorized } from "../middlewares/auth.middleware.js";
import { getCashDisbursementTransactionReport, getCashReceiptsTransactionReport, getSalesOnAccountReport, getGeneralJournalReport, getPurchaseOnAccountReport } from "../controllers/report.controller.js";
import { hasViewJournalReport } from "../middlewares/permission.middleware.js";
const router = express.Router();

router.post( "/cash-disbursement", isAuthorized, getCashDisbursementTransactionReport );
router.post( "/cash-receipts", isAuthorized, getCashReceiptsTransactionReport );
router.post( "/sales-on-account", isAuthorized, getSalesOnAccountReport );
router.post( "/purchase-on-account", isAuthorized, getPurchaseOnAccountReport );
router.post( "/general-journal", isAuthorized, getGeneralJournalReport);

export default router;
