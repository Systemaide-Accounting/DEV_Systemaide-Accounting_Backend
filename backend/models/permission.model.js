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

// Initialize default permissions
(async () => {
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
        }
    ];

    const count = await Permission.estimatedDocumentCount();

    if (count === 0) {
      await Permission.create(defaultPermissions);
    }
  } catch (error) {
    console.error("Error initializing permissions: ", error);
  }
})();

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;