import express from 'express';
import rateLimit from 'express-rate-limit'; // Import rate-limit
import { isAuthorized, isBearerTokenValid } from "../middlewares/auth.middleware.js";
// Import new controller functions
import { signIn, verifyUser, forgotPassword, resetPassword, signOut } from '../controllers/auth.controller.js';

const router = express.Router();

// Rate limiter for password reset requests (e.g., 5 requests per 15 minutes per IP)
const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many password reset attempts from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post("/signin", isBearerTokenValid, signIn);
router.post("/verify", verifyUser);
router.post("/signout", isAuthorized, signOut);

// Add new routes with rate limiting
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);

export default router;