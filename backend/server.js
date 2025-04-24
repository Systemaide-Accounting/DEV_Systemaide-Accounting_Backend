import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import { connectDB } from "./config/db.js";

// ROUTES
import endpointsRoutes from "./routes/endpoints.route.js";
import connectionRoutes from "./routes/connection.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import companyInfoRoutes from "./routes/companyInfo.route.js";
import agentInfoRoutes from "./routes/agentInfo.route.js";
import chartOfAccountRoutes from "./routes/chartOfAccount.route.js";
import permissionRoutes from "./routes/permission.route.js";
import roleRoutes from "./routes/role.route.js";
import locationRoutes from "./routes/location.route.js";
import branchRoutes from "./routes/branch.route.js";
import cashDisbursementTransactionRoutes from "./routes/cashDisbursementTransaction.route.js";
import cashReceiptsTransactionRoutes from "./routes/cashReceiptsTransaction.route.js";
import salesOnAccountRoutes from "./routes/salesOnAccount.route.js";
import generalJournalRoutes from "./routes/generalJournal.route.js";
import purchaseOnAccountTransactionRoutes from "./routes/purchaseOnAccountTransaction.route.js";
import reportRoutes from "./routes/report.route.js";

// MIDDLEWARES
import errorMiddleware from "./middlewares/error.middleware.js";

import cookieParser from "cookie-parser";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());

// Use CORS with dynamic origin
const allowedOrigins = [
	process.env.FRONTEND_URL_DEVELOPMENT_1,
	process.env.FRONTEND_URL_DEVELOPMENT_2,
	process.env.FRONTEND_URL_PRODUCTION,
];
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	})
);

// Routes for API calls
app.use("/api/connection", connectionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/company", companyInfoRoutes);
app.use("/api/agent", agentInfoRoutes);
app.use("/api/chart-of-account", chartOfAccountRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/cash-disbursement", cashDisbursementTransactionRoutes);
app.use("/api/cash-receipts", cashReceiptsTransactionRoutes);
app.use("/api/sales-on-account", salesOnAccountRoutes);
app.use("/api/purchase-on-account", purchaseOnAccountTransactionRoutes);
app.use("/api/endpoints", endpointsRoutes);
app.use("/api/general-journal", generalJournalRoutes);
app.use("/api/report", reportRoutes);

// Error handling middleware
app.use(errorMiddleware);

// http://localhost:${PORT}
app.listen(PORT, async () => {
	connectDB();
	console.log(`SYSTEMAIDE Server running on port ${PORT}`);
});
