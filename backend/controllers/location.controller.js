import Branch from "../models/branch.model.js";
import Location from "../models/location.model.js";
import mongoose from "mongoose";

const isBranchDeleted = async (branch) => {
    const deletedBranch = await Branch.findOne({ _id: branch?._id, isDeleted: true });
    return deletedBranch ? true : false;
};

const isLocationTINExisting = async (location) => {
    const existingLocation = await Location.findOne({
        tin: location?.tin,
        isDeleted: { $ne: true },
    });
    return existingLocation;
}

export const getAllLocations = async (req, res, next) => {
    try {
        const locations = await Location.find({ isDeleted: { $ne: true } }).populate("branch");

        // check if branch is deleted
        locations.forEach(async (location) => {
          if (location.branch && (await isBranchDeleted(location.branch))) {
            location.branch = null;
          }
        });

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

        const existingLocation = await isLocationTINExisting(location);

        if (existingLocation) {
            return res.status(400).json({
                success: false,
                message: "Location TIN already exists",
            });
        }

        if(!location?.branch) {
            delete location.branch;
        }
        
        if (!mongoose.Types.ObjectId.isValid(location?.branch) || (location.branch && await isBranchDeleted(location.branch))) {
            return res.status(400).json({
                success: false,
                message: "Invalid branch input",
            });
        }

        let newLocation = await Location.create(location);
        newLocation = await newLocation.populate("branch");

        // check if branch is deleted
        if (newLocation.branch && await isBranchDeleted(newLocation.branch)) {
            newLocation.branch = null;
        }

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
        }).populate("branch");

        if (!location) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        // check if branch is deleted
        if (location.branch && await isBranchDeleted(location.branch)) {
            location.branch = null;
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

        const existingLocation = await Location.findOne({
            tin: location?.tin,
            isDeleted: { $ne: true },
            _id: { $ne: locationId },
        });

        if (existingLocation) {
            return res.status(400).json({
                success: false,
                message: "Location TIN already exists",
            });
        }

        const updatedLocation = await Location.findOneAndUpdate(
            { _id: locationId, isDeleted: { $ne: true } },
            location,
            { new: true, runValidators: true }
        ).populate("branch");

        if (!updatedLocation) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        // check if branch is deleted
        if (updatedLocation.branch && await isBranchDeleted(updatedLocation.branch)) {
            updatedLocation.branch = null;
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