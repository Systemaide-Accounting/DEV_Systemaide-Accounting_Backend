import express from "express";
import { getAllTransactionLogs, getTransactionLogById, createTransactionLog, deleteTransactionLog, getLogsForSpecificTransaction, getLogsForSpecificTransactionId, restoreTransactionLog, getAllDeletedTransactionLogs } from "../controllers/transactionLog.controller.js"; // Import the controller functions
import { hasViewTransactionLog, hasViewTransactionLogById, hasCreateTransactionLog, hasDeleteTransactionLog, hasRestoreTransactionLog } from "../middlewares/permission.middleware.js";
import { isAuthorized, isSysAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/deleted", isAuthorized, isSysAdmin, hasRestoreTransactionLog, getAllDeletedTransactionLogs);

// Get all transaction logs - requires authentication and permission to view logs
router.get("/", isAuthorized, hasViewTransactionLog, getAllTransactionLogs);

// Create a new log - requires authentication and permission to create logs
router.post("/", isAuthorized, hasCreateTransactionLog, createTransactionLog);

// Get all logs for a specific transaction type - requires authentication and permission to view logs
router.get("/transaction/:transactionType", isAuthorized, hasViewTransactionLog, getLogsForSpecificTransaction);

// Get all logs for a specific transaction type and transaction ID - requires authentication and permission to view logs
router.get("/transaction/:transactionType/:transactionId", isAuthorized, hasViewTransactionLog, getLogsForSpecificTransactionId);

// Get a single log by ID - requires authentication and permission to view logs by ID
router.get("/:id", isAuthorized, hasViewTransactionLogById, getTransactionLogById);

// Soft delete a log by ID - requires authentication, sysAdmin permission, and permission to delete logs
router.delete("/:id", isAuthorized, isSysAdmin, hasDeleteTransactionLog, deleteTransactionLog);

// Restore a soft-deleted log by ID - requires authentication, sysAdmin permission, and permission to restore logs
router.patch("/restore/:id", isAuthorized, isSysAdmin, hasRestoreTransactionLog, restoreTransactionLog);

// Export the router to use in your app
export default router;
