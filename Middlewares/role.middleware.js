import { apiError } from "../Utils/apiError.js";

export const authorizeRoles = (...roles) => {

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new apiError(403, "Access Denied");
    }
    next();
  };
};