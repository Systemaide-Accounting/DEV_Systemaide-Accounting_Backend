import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import mongoose from "mongoose";

export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find({}).populate("permissions");
        res.status(200).json({
            success: true,
            data: roles,
        });
    } catch (error) {
        next(error);
    }
};

export const createRole = async (req, res, next) => {
    try {
      const role = { ...req.body };

      // Check for existing role
      const existingRole = await Role.findOne({ name: role.name.trim() });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: "Role name already exists",
        });
      }

      // check if permissions are valid
      const permissions = Array.isArray(role?.permissions)
        ? role?.permissions
        : [];

      // Validate permissions array
      if (permissions.length > 0) {
        const invalidPermissions = permissions.filter(
          (permission) => !mongoose.Types.ObjectId.isValid(permission)
        );

        if (invalidPermissions.length > 0) {
          return res.status(400).json({
            success: false,
            message: "There are Invalid permission(s)",
            errors: {
              invalidPermissions,
              totalInvalid: invalidPermissions.length,
            },
          });
        }

        // Verify permissions exist in database
        const permissionCount = await Permission.countDocuments({
          _id: { $in: permissions },
        });

        if (permissionCount !== permissions.length) {
          return res.status(400).json({
            success: false,
            message: "Some permission(s) are invalid",
            errors: {
              provided: permissions.length,
              found: permissionCount,
            },
          });
        }
      }

      //   const validPermissions = permissions.every((permission) =>
      //     mongoose.Types.ObjectId.isValid(permission)
      //   );
      //   if (!validPermissions) {
      //     return res.status(400).json({
      //       success: false,
      //       message: "Invalid permission name",
      //     });
      //   }

      let newRole = await Role.create(role);
      newRole = await newRole.populate("permissions");

      res.status(201).json({
        success: true,
        data: newRole,
      });
    } catch (error) {
        next(error);
    }
};

export const getRoleById = async (req, res, next) => {
    try {
        const { id: roleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        const role = await Role.findOne({
          _id: roleId,
        }).populate("permissions");

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        res.status(200).json({
            success: true,
            data: role,
        });
    } catch (error) {
        next(error);
    }
};

export const updateRole = async (req, res, next) => {
    try {
      const { id: roleId } = req.params;
      const role = { ...req.body };

      if (!mongoose.Types.ObjectId.isValid(roleId)) {
        return res.status(404).json({
          success: false,
          message: "Role not found",
        });
      }

      const existingRole = await Role.findOne({
        name: role.name,
        _id: { $ne: roleId },
      });

      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: "Role name already exists",
        });
      }

      // check if permissions are valid
      const permissions = Array.isArray(role?.permissions)
        ? role?.permissions
        : [];

      // Validate permissions array
      if (permissions.length > 0) {
        const invalidPermissions = permissions.filter(
          (permission) => !mongoose.Types.ObjectId.isValid(permission)
        );

        if (invalidPermissions.length > 0) {
          return res.status(400).json({
            success: false,
            message: "There are Invalid permission(s)",
            errors: {
              invalidPermissions,
              totalInvalid: invalidPermissions.length,
            },
          });
        }

        // Verify permissions exist in database
        const permissionCount = await Permission.countDocuments({
          _id: { $in: permissions },
        });

        if (permissionCount !== permissions.length) {
          return res.status(400).json({
            success: false,
            message: "Some permission(s) are invalid",
            errors: {
              provided: permissions.length,
              found: permissionCount,
            },
          });
        }
      }

      const updatedRole = await Role.findByIdAndUpdate(roleId, role, {
        new: true,
        runValidators: true,
      });

      if (!updatedRole) {
        return res.status(404).json({
          success: false,
          message: "Role not found",
        });
      }

      res.status(200).json({
        success: true,
        data: updatedRole,
      });
    } catch (error) {
        next(error);
    }
};

export const deleteRole = async (req, res, next) => {
    try {
        const { id: roleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        const deletedRole = await Role.findByIdAndDelete(roleId);

        if (!deletedRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        res.status(200).json({
          success: true,
          data: deletedRole,
        });
    } catch (error) {
        next(error);
    }
};