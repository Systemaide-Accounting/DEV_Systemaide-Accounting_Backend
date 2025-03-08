import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import { connectDB } from './config/db.js';

// ROUTES
import connectionRoutes from './routes/connection.route.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import companyInfoRoutes from './routes/companyInfo.route.js';
import agentInfoRoutes from './routes/agentInfo.route.js';
import chartOfAccountRoutes from './routes/chartOfAccount.route.js';
import permissionRoutes from './routes/permission.route.js';
import roleRoutes from './routes/role.route.js';
// MIDDLEWARES
import errorMiddleware from './middlewares/error.middleware.js';

import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
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
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    })
);

// Routes for API calls
app.use('/api/connection', connectionRoutes);
app.use('/api/users', userRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/company', companyInfoRoutes);
app.use('/api/agent', agentInfoRoutes);
app.use('/api/chart-of-account', chartOfAccountRoutes);

// Error handling middleware
app.use(errorMiddleware);

// http://localhost:${PORT}
app.listen(PORT, async () => {
    connectDB();
    console.log(`SYSTEMAIDE Server running on port ${PORT}`);
});