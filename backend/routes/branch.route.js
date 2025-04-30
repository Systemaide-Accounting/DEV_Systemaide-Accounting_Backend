import express from 'express';
import { createBranch, deleteBranch, getAllBranches, getBranchById, updateBranch, restoreBranch} from '../controllers/branch.controller.js';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { hasCreateBranch, hasDeleteBranch, hasUpdateBranch, hasViewAllBranches, hasViewBranchById, hasRestoreBranch } from '../middlewares/permission.middleware.js';
const router = express.Router();

router.get('/', isAuthorized, hasViewAllBranches, getAllBranches);
router.get('/:id', isAuthorized, hasViewBranchById, getBranchById);
router.post('/', isAuthorized, hasCreateBranch, createBranch);
router.patch('/:id', isAuthorized, hasUpdateBranch, updateBranch);
router.delete("/delete/:id", isAuthorized, hasDeleteBranch, deleteBranch);
router.patch("/restore/:id", isAuthorized, hasRestoreBranch, restoreBranch);

export default router;