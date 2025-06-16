import express from 'express';
import { isAuthorized, isSysAdmin } from '../middlewares/auth.middleware.js';
import { createRole, deleteRole, getAllRoles, getRoleById, updateRole } from '../controllers/role.controller.js';
import { hasCreateRole, hasDeleteRole, hasUpdateRole, hasViewAllRoles, hasViewRoleById } from '../middlewares/permission.middleware.js';

const router = express.Router();

router.get("/", isAuthorized, isSysAdmin, hasViewAllRoles, getAllRoles);
router.get("/:id", isAuthorized, isSysAdmin, hasViewRoleById, getRoleById);
router.post("/", isAuthorized, isSysAdmin, hasCreateRole, createRole);
router.patch("/:id", isAuthorized, isSysAdmin, hasUpdateRole, updateRole);
router.delete("/:id", isAuthorized, isSysAdmin, hasDeleteRole, deleteRole);

export default router;