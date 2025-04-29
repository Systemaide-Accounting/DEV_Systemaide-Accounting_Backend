import AgentInfo from "../models/agentInfo.model.js";
import mongoose from "mongoose";
import { encryptTIN, decryptTIN } from "../helpers/encryptDecryptUtils.js";

const isAgentTINExisting = async (agent) => {
    const existingAgent = await AgentInfo.findOne({
      tin: agent?.tin,
      isDeleted: { $ne: true },
    });
    return existingAgent;
};

const isAgentCodeExisting = async (agent) => {
  const existingAgent = await AgentInfo.findOne({
    agentCode: agent?.agentCode,
    isDeleted: { $ne: true },
  });
  return existingAgent;
};

export const getAllAgents = async (req, res, next) => {
    try {
        let agentInfos = await AgentInfo.find({ isDeleted: { $ne: true } });

        // Decrypt TINs
        agentInfos = agentInfos.map((agent) => {
          const agentObj = agent.toObject();
          try {
            // Only attempt to decrypt if tin exists and is not empty
            if (agentObj.tin) {
              agentObj.tin = decryptTIN(agentObj.tin);
            }
          } catch (decryptError) {
            console.error(
              `Failed to decrypt TIN for transaction ${agentObj._id}:`,
              decryptError.message
            );
            agentObj.tin = ""; // Set to empty string on decryption failure
          }
          return agentObj;
        });

        res.status(200).json({
          success: true,
          data: agentInfos,
        });
    } catch (error) {
        next(error);
    }
};

export const createAgent = async (req, res, next) => {
    try {
        const agent = { ...req.body };

        // Remove restricted fields
        delete agent.isDeleted;
        delete agent.deletedAt;

        const existingAgentTin = await isAgentTINExisting(agent);

        if (existingAgentTin) {
          return res.status(400).json({
            success: false,
            message: "Agent TIN already exists",
          });
        }

        const existingAgentCode = await isAgentCodeExisting(agent);

        if (existingAgentCode) {
          return res.status(400).json({
            success: false,
            message: "Agent code already exists",
          });
        }

        // Encrypt TIN before saving
        if (agent?.tin) {
          agent.tin = encryptTIN(agent.tin);
        }

        const newAgent = await AgentInfo.create(agent);

        res.status(201).json({
          success: true,
          data: newAgent,
        });
    } catch (error) {
        next(error);
    }
};

export const getAgentById = async (req, res, next) => {
    try {
        const { id: agentId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(agentId)) {
          return res.status(404).json({
            success: false,
            message: "Agent not found",
          });
        }

        const agent = await AgentInfo.findOne({
          _id: agentId,
          isDeleted: { $ne: true },
        });

        if (!agent) {
          return res.status(404).json({
            success: false,
            message: "Agent not found",
          });
        }

        res.status(200).json({
          success: true,
          data: {
            ...agent.toObject(),
            tin: decryptTIN(agent.tin), // Decrypt TIN before sending response
          },
        });
    } catch (error) {
        next(error);
    }
};

export const updateAgent = async (req, res, next) => {
    try {
        const { id: agentId } = req.params;
        const agent = { ...req.body };

        // Remove restricted fields
        delete agent.isDeleted;
        delete agent.deletedAt;

        if(!mongoose.Types.ObjectId.isValid(agentId)) {
          return res.status(404).json({
            success: false,
            message: "Agent not found",
          });
        }

        const existingAgentTin = await AgentInfo.findOne({
          tin: agent?.tin,
          _id: { $ne: agentId },
          isDeleted: { $ne: true },
        });

        if (existingAgentTin) {
          return res.status(400).json({
            success: false,
            message: "Agent with the same TIN already exists",
          });
        }

        const existingAgentCode = await AgentInfo.findOne({
          agentCode: agent?.agentCode,
          _id: { $ne: agentId },
          isDeleted: { $ne: true },
        });

        if (existingAgentCode) {
          return res.status(400).json({
            success: false,
            message: "Agent with the same code already exists",
          });
        }

        // Encrypt TIN before saving
        if (agent?.tin) {
          agent.tin = encryptTIN(agent.tin);
        }

        const updatedAgent = await AgentInfo.findOneAndUpdate(
          { _id: agentId, isDeleted: { $ne: true } },
          agent,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!updatedAgent) {
          return res.status(404).json({
            success: false,
            message: "Agent not found",
          });
        }

        res.status(200).json({
          success: true,
          data: updatedAgent,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAgent = async (req, res, next) => {
  try {
    const { id: agentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const deletedAgent = await AgentInfo.findOneAndUpdate(
      { _id: agentId, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() },
      { new: true, runValidators: true, }
    );

    if (deletedAgent.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Agent is already deleted",
      });
    }

    if (!deletedAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedAgent,
    });
  } catch (error) {
    next(error);
  }
};

export const restoreAgent = async (req, res, next) => {
  try {
    const { id: agentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const restoredAgent = await AgentInfo.findOneAndUpdate(
      { _id: agentId, isDeleted: true },
      { isDeleted: false, restoredAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!restoredAgent.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Agent is not deleted",
      });
    }

    if (!restoredAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restoredAgent,
    });
  } catch (error) {
    next(error);
  }
}