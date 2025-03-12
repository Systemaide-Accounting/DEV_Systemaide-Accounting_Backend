import mongoose from "mongoose";
import Permission from "./permission.model.js";

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      enum: ["regular", "manager", "admin", "sysadmin"],
      required: [true, "Role name is required"],
      trim: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Initialize sysadmin role
(async () => {
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
    }
    catch (error) {
      console.error("Error initializing sysadmin role: ", error);
    }
})();

const Role = mongoose.model("Role", roleSchema);

export default Role;