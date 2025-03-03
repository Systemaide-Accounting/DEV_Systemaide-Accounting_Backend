import express from "express";
import { isAuthorized } from "../middlewares/auth.middleware.js";
import { getAllAgents } from "../controllers/agentInfo.controller.js";

const router = express.Router();

router.get("/", getAllAgents);

export default router;