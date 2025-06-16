import express from "express";
import { isAuthorized, isSysAdmin } from "../middlewares/auth.middleware.js";
import { createAgent, deleteAgent, getAgentById, getAllAgents, updateAgent, restoreAgent, getAllDeletedAgents } from "../controllers/agentInfo.controller.js";
import { hasCreateAgent, hasDeleteAgent, hasUpdateAgent, hasViewAgentById, hasViewAllAgents, hasRestoreAgent } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/deleted", isAuthorized, hasRestoreAgent, getAllDeletedAgents);

router.get("/", isAuthorized, hasViewAllAgents, getAllAgents);
router.post("/", isAuthorized, hasCreateAgent, createAgent);
router.get("/:id", isAuthorized, hasViewAgentById, getAgentById);
router.patch("/:id", isAuthorized, hasUpdateAgent, updateAgent);
router.delete("/:id", isAuthorized, hasDeleteAgent, deleteAgent);
router.patch("/restore/:id", isAuthorized, hasRestoreAgent, restoreAgent);

export default router;