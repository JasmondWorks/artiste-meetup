import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import appConfig from "../config/env.config";
import { AppError } from "../utils/app-error.util";
import User, { IUser } from "../modules/user/user.model";
import { UserRole } from "../modules/user/user.entity";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

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

// Silently attaches req.user if a valid Bearer token is present; never blocks the request.
export const optionalProtect = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer")) return next();

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, appConfig.jwt.accessSecret) as { id: string };
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch {
    // Invalid or expired token — proceed as unauthenticated
  }
  next();
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.some((r) => req.user!.roles.includes(r))) {
      return next(new AppError("Permission denied", 403));
    }
    next();
  };
};
