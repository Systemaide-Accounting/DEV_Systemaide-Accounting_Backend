// User Permissions
export const hasViewAllUsers = async (req, res, next) => {
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
export const hasCreateUser = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("createUser")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to create user",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasViewUserById = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewUserById")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view user by id",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasUpdateUser = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("updateUser")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to update user",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasDeleteUser = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("deleteUser")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to delete user",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};

// Role Permissions
export const hasViewAllRoles = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewAllRoles")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view all roles",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasCreateRole = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("createRole")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to create role",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasViewRoleById = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewRoleById")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view role by id",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasUpdateRole = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("updateRole")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to update role",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasDeleteRole = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("deleteRole")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to delete role",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};

// Permission Permissions
export const hasViewAllPermissions = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewAllPermissions")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view all permissions",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasCreatePermission = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("createPermission")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to create permission",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasViewPermissionById = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewPermissionById")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view permission by id",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasUpdatePermission = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("updatePermission")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to update permission",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasDeletePermission = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("deletePermission")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to delete permission",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};

// AgentInfo Permissions
export const hasViewAllAgents = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewAllAgents")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view all agents",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasCreateAgent = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("createAgent")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to create agent",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasViewAgentById = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewAgentById")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view agent by id",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasUpdateAgent = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("updateAgent")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to update agent",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasDeleteAgent = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("deleteAgent")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to delete agent",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};

// CompanyInfo Permissions
export const hasViewAllCompanies = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewAllCompanies")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view all companies",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasCreateCompany = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("createCompany")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to create company",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasViewCompanyById = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewCompanyById")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view company by id",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasUpdateCompany = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("updateCompany")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to update company",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasDeleteCompany = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("deleteCompany")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to delete company",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};

// ChartOfAccount Permissions
export const hasViewAllAccounts = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewAllAccounts")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view all accounts",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasCreateAccount = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("createAccount")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to create account",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasViewAccountById = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewAccountById")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view account by id",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasUpdateAccount = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("updateAccount")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to update account",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasDeleteAccount = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("deleteAccount")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to delete account",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};

// Location Permissions
export const hasViewAllLocations = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewAllLocations")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view all locations",
        });
    }
    catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasCreateLocation = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("createLocation")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to create location",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasViewLocationById = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("viewLocationById")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to view location by id",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasUpdateLocation = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("updateLocation")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to update location",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};
export const hasDeleteLocation = async (req, res, next) => {
    try {
        if (req.user.role && req.user.permissions.includes("deleteLocation")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "No Permission to delete location",
        });
    } catch (error) {
        error.statusCode = 403;
        next(error);
    }
};