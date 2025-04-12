import listEndpoints from "express-list-endpoints";
import { app } from "../server.js"; // Import the app instance from server.js

export const getAllEndpoints = (req, res, next) => {
    try {
        const endpoints = listEndpoints(app);
        res.status(200).json({
            success: true,
            data: endpoints,
        });
    } catch (error) {
        next(error);
    }
};