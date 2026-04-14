import { apiError } from "../Utils/apiError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof apiError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};