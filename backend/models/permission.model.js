import mongoose from "mongoose";

const permissionSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Permission name is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, 
{
    timestamps: true,
});

const Permission = mongoose.model("Permission", permissionSchema);

// Initialize default permissions
(async () => {
  try {
    
    const defaultPermissions = [
        {
            name: "viewAllUsers",
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
            name: "deleteUser",
            description: "Delete User",
        },
        {
            name: "viewAllRoles",
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
            name: "deleteRole",
            description: "Delete Role",
        },
        {
            name: "viewAllPermissions",
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
        {
            name: "deletePermission",
            description: "Delete Permission",
        },
    ];

    const count = await Permission.estimatedDocumentCount();

    if (count === 0) {
      await Permission.create(defaultPermissions);
    }
  } catch (error) {
    console.error("Error initializing permissions: ", error);
  }
})();

export default Permission;