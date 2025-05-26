import express from 'express';
import { isAuthorized, isSysAdmin } from '../middlewares/auth.middleware.js';
import { createPermission, deletePermission, getAllPermissions, getPermissionById, updatePermission } from '../controllers/permission.controller.js';
import { hasCreatePermission, hasDeletePermission, hasUpdatePermission, hasViewAllPermissions, hasViewPermissionById } from '../middlewares/permission.middleware.js';

const router = express.Router();

router.get("/", isAuthorized, isSysAdmin, hasViewAllPermissions, getAllPermissions);
router.get("/:id", isAuthorized, isSysAdmin, hasViewPermissionById, getPermissionById);
router.post("/", isAuthorized, isSysAdmin, hasCreatePermission, createPermission);
router.patch("/:id", isAuthorized, isSysAdmin, hasUpdatePermission, updatePermission);
router.delete("/:id", isAuthorized, isSysAdmin, hasDeletePermission, deletePermission);

export default router;