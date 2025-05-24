import express from 'express';
import { isAdmin, isAuthorized, isRegular, isSysAdmin } from '../middlewares/auth.middleware.js';
import { blockUser, createUser, getAllUsers, getUserById, updateUser, unblockUser, getAllBlockedUsers } from '../controllers/user.controller.js';
import { hasCreateUser, hasDeleteUser, hasUpdateUser, hasViewAllUsers, hasViewUserById, hasRestoreUser } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/blocked", isAuthorized, isSysAdmin, getAllBlockedUsers);

router.get("/", isAuthorized, isSysAdmin, hasViewAllUsers, getAllUsers);
router.post("/", isAuthorized, isSysAdmin, hasCreateUser, createUser);
router.get("/:id", isAuthorized, isSysAdmin, hasViewUserById, getUserById);
router.patch("/:id", isAuthorized, isSysAdmin, hasUpdateUser, updateUser);
router.patch("/block/:id", isAuthorized, isSysAdmin, hasDeleteUser, blockUser);
router.patch("/restore/:id", isAuthorized, isSysAdmin, hasRestoreUser, unblockUser);

export default router;