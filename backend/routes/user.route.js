import express from 'express';
import { isAuthorized, isSysAdmin } from '../middlewares/auth.middleware.js';
import { getAllUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', isAuthorized, isSysAdmin, getAllUsers);

export default router;