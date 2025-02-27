import express from 'express';
import { isBearerTokenValid } from "../middlewares/auth.middleware.js";
import { signIn, verifyUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signin", isBearerTokenValid, signIn);
router.post("/verify", verifyUser);

export default router;