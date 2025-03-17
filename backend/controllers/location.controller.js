import Location from "../models/location.model.js";
import mongoose from "mongoose";

export const getAllLocations = async (req, res, next) => {
    try {
        const locations = await Location.find({ isDeleted: { $ne: true } });
        res.status(200).json({
            success: true,
            data: locations,
        });
    } catch (error) {
        next(error);
    }
};

export const createLocation = async (req, res, next) => {
    try {
        const location = { ...req.body };

        // Remove restricted fields
        delete location.isDeleted;
        delete location.deletedAt;

        const newLocation = await Location.create(location);

        res.status(201).json({
          success: true,
          data: newLocation,
        });
    } catch (error) {
        next(error);
    }
};

export const getLocationById = async (req, res, next) => {
    try {
        const { id: locationId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(locationId)) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        const location = await Location.findOne({
          _id: locationId,
          isDeleted: { $ne: true },
        });

        if (!location) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        res.status(200).json({
          success: true,
          data: location,
        });
    } catch (error) {
        next(error);
    }
};

export const updateLocation = async (req, res, next) => {
    try {
        const { id: locationId } = req.params;
        const location = { ...req.body };

        // Remove restricted fields
        delete location.isDeleted;
        delete location.deletedAt;

        if(!mongoose.Types.ObjectId.isValid(locationId)) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        const updatedLocation = await Location.findOneAndUpdate(
            { _id: locationId, isDeleted: { $ne: true } },
            location,
            { new: true, runValidators: true }
        );

        if (!updatedLocation) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        res.status(200).json({
          success: true,
          data: updatedLocation,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteLocation = async (req, res, next) => {
    try {
        const { id: locationId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(locationId)) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        const deletedLocation = await Location.findOneAndUpdate(
            { _id: locationId, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!deletedLocation) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        res.status(200).json({
          success: true,
          data: deletedLocation,
        });
    } catch (error) {
        next(error);
    }
};