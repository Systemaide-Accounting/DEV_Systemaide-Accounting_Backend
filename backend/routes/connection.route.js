import express from 'express';
import { isBearerTokenValid } from "../middlewares/auth.middleware.js";
import { getConnection } from '../controllers/connection.controller.js';

const router = express.Router();

router.get("/", getConnection);

export default router;