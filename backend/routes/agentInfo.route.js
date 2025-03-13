import express from "express";
import { isAuthorized, isSysAdmin } from "../middlewares/auth.middleware.js";
import { createAgent, deleteAgent, getAgentById, getAllAgents, updateAgent } from "../controllers/agentInfo.controller.js";
import { hasCreateAgent, hasDeleteAgent, hasUpdateAgent, hasViewAgentById, hasViewAllAgents } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", isAuthorized, hasViewAllAgents, getAllAgents);
router.post("/", isAuthorized, hasCreateAgent, createAgent);
router.get("/:id", isAuthorized, hasViewAgentById, getAgentById);
router.patch("/:id", isAuthorized, hasUpdateAgent, updateAgent);
router.patch("/delete/:id", isAuthorized, hasDeleteAgent, deleteAgent);

export default router;