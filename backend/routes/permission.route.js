import express from 'express';
import { isAuthorized, isSysAdmin } from '../middlewares/auth.middleware.js';
import { createPermission, deletePermission, getAllPermissions, getPermissionById, updatePermission } from '../controllers/permission.controller.js';

const router = express.Router();

router.get("/", isAuthorized, isSysAdmin, getAllPermissions);
router.get("/:id", isAuthorized, isSysAdmin, getPermissionById);
router.post("/", isAuthorized, isSysAdmin, createPermission);
router.patch("/:id", isAuthorized, isSysAdmin, updatePermission);
router.delete("/delete/:id", isAuthorized, isSysAdmin, deletePermission);

export default router;