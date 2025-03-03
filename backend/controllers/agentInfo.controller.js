import AgentInfo from "../models/agentInfo.model.js";
import mongoose from "mongoose";

export const getAllAgents = async (req, res, next) => {
    try {
        const agentInfos = await AgentInfo.find({ isDeleted: { $ne: true } });
        res.status(200).json({
          success: true,
          data: agentInfos,
        });
    } catch (error) {
        next(error);
    }
};
// CONTINUE THIS...