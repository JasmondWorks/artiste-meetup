import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import appConfig from "@/config/env.config";
import { AppError } from "@/utils/app-error.util";
import User, { IUser } from "@/modules/user/user.model";
import { UserRole } from "@/modules/user/user.entity";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Verify Bearer token, load user from DB, attach to req.user
export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("Not logged in", 401));

  try {
    const decoded = jwt.verify(token, appConfig.jwt.accessSecret) as { id: string };
    const user = await User.findById(decoded.id).select("+password");

    if (!user) return next(new AppError("User no longer exists", 401));

    req.user = user;
    next();
  } catch {
    return next(new AppError("Invalid token", 401));
  }
};

// Only allow specified roles
export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Permission denied", 403));
    }

    next();
  };
};
