import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// the accessToken serves as the bearer token for endpoints that verifies users that are logged in
export const isAuthorized = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer")) {
          return res.status(404).json({
            success: false,
            message: "Unauthorized",
          });
        }

        const accessToken = token.split(" ")[1];

        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

        const user = await User.findOne({
          _id: decodedToken?.id,
          status: { $ne: "blocked" },
        }).select("-password");

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "Unauthorized",
          });
        }

        req.user = user;

        next();
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
};

// verify bearer token in open endpoints
export const isBearerTokenValid = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    // console.log(token);
    
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bearerToken = token.split(" ")[1];

    const decodedToken = jwt.verify(bearerToken, process.env.API_BEARER_SECRET);

    // const isValid =
    //   decodedToken?.securityToken !== process.env.API_SECURITY_TOKEN;

    if (decodedToken?.securityToken !== process.env.API_SECURITY_TOKEN) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized",
      });
    }

    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

export const isSysAdmin = async (req, res, next) => {
    try {
        if(req.user.role === "sysadmin") { 
            return next();
        }
        
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if(req.user.role === "sysadmin" || req.user.role === "admin") {
           return next(); 
        }
        
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
}

export const isManager = async (req, res, next) => {
    try {
        if (req.user.role === "sysadmin" || req.user.role === "manager") {
          return next();
        }
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
}

export const isRegular = async (req, res, next) => {
    try {
        if (req.user.role === "sysadmin" || req.user.role === "regular") {
          return next();
        }
        
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
}