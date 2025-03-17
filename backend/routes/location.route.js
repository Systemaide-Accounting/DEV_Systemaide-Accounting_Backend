import express from 'express';
import { createLocation, deleteLocation, getAllLocations, getLocationById, updateLocation } from '../controllers/location.controller.js';
import { isAuthorized } from '../middlewares/auth.middleware.js';
import { hasCreateLocation, hasDeleteLocation, hasUpdateLocation, hasViewAllLocations, hasViewLocationById } from '../middlewares/permission.middleware.js';

const router = express.Router();

router.get('/', isAuthorized, hasViewAllLocations, getAllLocations);
router.post('/', isAuthorized, hasCreateLocation, createLocation);
router.get('/:id', isAuthorized, hasViewLocationById, getLocationById);
router.patch('/:id', isAuthorized, hasUpdateLocation, updateLocation);
router.patch('/delete/:id', isAuthorized, hasDeleteLocation, deleteLocation);

export default router;