import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import { connectDB } from './config/db.js';

import connectionRoutes from './routes/connection.route.js';

import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Error handling middleware
app.use(errorMiddleware);

app.listen(PORT, async () => {
    connectDB();
    console.log(`SYSTEMAIDE Server running on port ${PORT}`);
});