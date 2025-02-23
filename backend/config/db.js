import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI
            .replace("${DB_USER}", process.env.DB_USER)
            .replace("${DB_PASSWORD}", process.env.DB_PASSWORD)
            .replace("${DB_NAME}", process.env.DB_NAME);
        const conn = await mongoose.connect(mongoUri, {});
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        // console.error("MongoDB connection FAIL");
        console.error(error.message);
        process.exit(1);
    }
};