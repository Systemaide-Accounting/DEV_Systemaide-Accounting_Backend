import express from 'express';
import { isBearerTokenValid } from "../middlewares/auth.middleware.js";
import { signIn } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signin", isBearerTokenValid, signIn);

export default router;