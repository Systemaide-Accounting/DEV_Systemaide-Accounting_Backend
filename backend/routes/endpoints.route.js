import express from "express";
import { isAuthorized } from "../middlewares/auth.middleware.js";
import { getAllEndpoints } from "../controllers/endpoints.controller.js";

const router = express.Router();

router.get("/", isAuthorized, getAllEndpoints);

export default router;