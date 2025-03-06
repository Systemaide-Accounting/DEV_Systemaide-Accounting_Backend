import express from "express";
import { isAuthorized, isSysAdmin } from "../middlewares/auth.middleware.js";
import { createAgent, deleteAgent, getAgentById, getAllAgents, updateAgent } from "../controllers/agentInfo.controller.js";

const router = express.Router();

router.get("/", isAuthorized, isSysAdmin, getAllAgents);
router.post("/", isAuthorized, isSysAdmin, createAgent);
router.get("/:id", isAuthorized, isSysAdmin, getAgentById);
router.patch("/:id", isAuthorized, isSysAdmin, updateAgent);
router.patch("/delete/:id", isAuthorized, isSysAdmin, deleteAgent);

export default router;