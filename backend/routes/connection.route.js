import express from 'express';
import { getConnection } from '../controllers/connection.controller.js';

const router = express.Router();

router.get('/', getConnection);

export default router;