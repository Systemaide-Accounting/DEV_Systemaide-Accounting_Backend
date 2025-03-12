import express from 'express';
import { isAuthorized, isSysAdmin } from '../middlewares/auth.middleware.js';
import { createRole, deleteRole, getAllRoles, getRoleById, updateRole } from '../controllers/role.controller.js';

const router = express.Router();

router.get("/", isAuthorized, isSysAdmin, getAllRoles);
router.get("/:id", isAuthorized, isSysAdmin, getRoleById);
router.post("/", isAuthorized, isSysAdmin, createRole);
router.patch("/:id", isAuthorized, isSysAdmin, updateRole);
router.delete("/delete/:id", isAuthorized, isSysAdmin, deleteRole);

export default router;