import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import bcrypt from "bcryptjs";

const initializeUser = async () => {
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const password = process.env.DEFAULT_SYSADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(password, salt);

        const count = await User.estimatedDocumentCount();
        if (count === 0) {
            await User.create({
            firstName: "Supreme",
            lastName: "Leader",
            email: "sysadmin.systemaide@gmail.com",
            password: hashedPassword,
            role: "sysadmin",
            status: "inactive",
            });
        }
        } catch (err) {
        console.error("Error creating default sysadmin user:", err);
        }
};

const initializeSysadminRole = async () => {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      const permissions = await Permission.find(); // Fetch all permissions
      const permissionIds = permissions.map((permission) => permission._id); // Extract permission IDs

      await Role.create({
        name: "sysadmin",
        permissions: permissionIds,
      });
    }
  } catch (error) {
    console.error("Error initializing sysadmin role: ", error);
  }
};

const initializePermissions = async () => {
    try {
      const defaultPermissions = [
        {
          name: "viewUsers",
          description: "View Users",
        },
        {
          name: "createUser",
          description: "Create User",
        },
        {
          name: "viewUserById",
          description: "View User By Id",
        },
        {
          name: "updateUser",
          description: "Update User",
        },
        {
          name: "viewRoles",
          description: "View Roles",
        },
        {
          name: "createRole",
          description: "Create Role",
        },
        {
          name: "viewRoleById",
          description: "View Role By Id",
        },
        {
          name: "updateRole",
          description: "Update Role",
        },
        {
          name: "viewPermissions",
          description: "View Permissions",
        },
        {
          name: "createPermission",
          description: "Create Permission",
        },
        {
          name: "viewPermissionById",
          description: "View Permission By Id",
        },
        {
          name: "updatePermission",
          description: "Update Permission",
        },
      ];

      const count = await Permission.estimatedDocumentCount();

      if (count === 0) {
        await Permission.create(defaultPermissions);
      }
    } catch (error) {
      console.error("Error initializing permissions: ", error);
    }
};

export const getConnection = async (req, res) => {
    try {
        await initializeUser();
        await initializeSysadminRole();
        await initializePermissions();

        res.status(200).json({
            success: true,
            // message: "Connected to the server",
            message: "Connected to SYSTEMAIDE server",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};