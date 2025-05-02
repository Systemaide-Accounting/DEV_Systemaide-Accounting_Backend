import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: [28, "First name cannot exceed 28 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            maxlength: [28, "Last name cannot exceed 28 characters"],
        },
        middleInitial: {
            type: String,
            trim: true,
            maxlength: [2, "Middle initial cannot exceed 2 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            match: [
                /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
                "Please enter a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password cannot be less than 8 characters"],
            match: [
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
            ],
        },
        role: {
            type: String,
            enum: ["regular", "manager", "admin", "sysadmin"],
            default: "regular",
            required: [true, "Role is required"],
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Role",
            // required: [true, "Role is required"],
        },
        status: {
            type: String,
            enum: ["active", "inactive", "blocked"],
            default: "inactive",
            required: [true, "Status is required"],
        },
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },
        blockedAt: {
            type: Date,
        },
        restoredAt: {
			type: Date,
		},
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

// Initialize a default sysadmin user
(async () => {
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
})();

export default User;
