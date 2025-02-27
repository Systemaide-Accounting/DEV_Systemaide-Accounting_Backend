import express from 'express';
import { isAdmin, isAuthorized, isRegular, isSysAdmin } from '../middlewares/auth.middleware.js';
import { blockUser, createUser, getAllUsers, getUserById, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/", isAuthorized, isSysAdmin, getAllUsers);
router.post("/", isAuthorized, isSysAdmin, createUser);
router.get("/:id", isAuthorized, isSysAdmin, getUserById);
router.patch("/:id", isAuthorized, isSysAdmin, updateUser);
router.patch("/block/:id", isAuthorized, isSysAdmin, blockUser);

export default router;