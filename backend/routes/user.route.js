import express from 'express';
import { isAdmin, isAuthorized, isRegular, isSysAdmin } from '../middlewares/auth.middleware.js';
import { blockUser, createUser, getAllUsers, getUserById, updateUser } from '../controllers/user.controller.js';
import { hasCreateUser, hasDeleteUser, hasUpdateUser, hasViewAllUsers, hasViewUserById } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", isAuthorized, isSysAdmin, hasViewAllUsers, getAllUsers);
router.post("/", isAuthorized, isSysAdmin, hasCreateUser, createUser);
router.get("/:id", isAuthorized, isSysAdmin, hasViewUserById, getUserById);
router.patch("/:id", isAuthorized, isSysAdmin, hasUpdateUser, updateUser);
router.patch("/block/:id", isAuthorized, isSysAdmin, hasDeleteUser, blockUser);

export default router;