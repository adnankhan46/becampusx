// api/middlewares/auth.js (updated)
import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    return next(errorHandler(401, "Unauthorized, please sign in"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(401, "Token is not valid"));
    }

    req.user = decoded;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(errorHandler(403, "You are not authorized to perform this action"));
    }
  });
};

export const verifyCompany = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isCompany) {
      next();
    } else {
      return next(errorHandler(403, "Only companies can perform this action"));
    }
  });
};

 
 

export const verifyCompanyOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isCompany || req.user.isAdmin) {
      next();
    } else {
      return next(errorHandler(403, "You are not authorized to access this resource"));
    }
  });
};