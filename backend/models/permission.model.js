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

export default Permission;