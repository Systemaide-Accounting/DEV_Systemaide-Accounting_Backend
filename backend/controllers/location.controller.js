import Branch from "../models/branch.model.js";
import Location from "../models/location.model.js";
import mongoose from "mongoose";
import { encryptTIN, decryptTIN } from "../helpers/encryptDecryptUtils.js";

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
        let locations = await Location.find({ isDeleted: { $ne: true } }).populate("branch");
      
        // check if branch is deleted
        locations.forEach(async (location) => {
          if (location?.branch && location.branch?.isDeleted) {
            location.branch = null;
          }
        });

        // Decrypt TIN if needed
        locations = locations.map((location) => {
          const locationObj = location.toObject();
          try {
            // Only attempt to decrypt if tin exists and is not empty
            if (locationObj.tin) {
              locationObj.tin = decryptTIN(locationObj.tin);
            }
          } catch (decryptError) {
            console.error(
              `Failed to decrypt TIN for transaction ${locationObj._id}:`,
              decryptError.message
            );
            locationObj.tin = ""; // Set to empty string on decryption failure
            }
          return locationObj;
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
        
        if(location?.branch) {
          if (!mongoose.Types.ObjectId.isValid(location?.branch) || (location.branch && location.branch.isDeleted)) {
              return res.status(400).json({
                  success: false,
                  message: "Invalid branch input",
              });
          }
        } else {
          delete location.branch;
        }

        // Encrypt TIN before saving
        if (location?.tin) {
          location.tin = encryptTIN(location.tin);
        }

        let newLocation = await Location.create(location);
        newLocation = await newLocation.populate("branch");

        // check if branch is deleted
        if (newLocation?.branch && newLocation.branch?.isDeleted) {
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
        if (location?.branch && location.branch?.isDeleted) {
          location.branch = null;
        }

        res.status(200).json({
          success: true,
          data: {
            ...location.toObject(),
            tin: decryptTIN(location.tin), // Decrypt TIN before sending response
          },
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

        if(location?.branch) {
          if (!mongoose.Types.ObjectId.isValid(location?.branch) || (location.branch && location.branch.isDeleted)) {
              return res.status(400).json({
                  success: false,
                  message: "Invalid branch input",
              });
          }
        } else {
          location.branch = null;
        }

        // Encrypt TIN before saving
        if (location?.tin) {
          location.tin = encryptTIN(location.tin);
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
        if (updatedLocation?.branch && updatedLocation.branch?.isDeleted) {
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

        if (deletedLocation.isDeleted) {
          return res.status(400).json({
            success: false,
            message: "Location is already deleted",
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

export const restoreLocation = async (req, res, next) => {
    try {
        const { id: locationId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(locationId)) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        const restoredLocation = await Location.findOneAndUpdate(
            { _id: locationId, isDeleted: true },
            { isDeleted: false, restoredAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!restoredLocation) {
          return res.status(404).json({
            success: false,
            message: "Location not found",
          });
        }

        if (!restoredLocation.isDeleted) {
          return res.status(400).json({
            success: false,
            message: "Location is not deleted",

          });
        }

        res.status(200).json({
          success: true,
          data: restoredLocation,
        });
    }
    catch (error) {
        next(error);
    }
}
