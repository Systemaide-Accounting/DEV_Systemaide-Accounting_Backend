export const hasViewAllUsersPermission = async (req, res, next) => {
    try {
      if (req.user.role && req.user.permissions.includes("viewAllUsers")) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "No Permission to view all",
      });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
