import { NextFunction, Request, Response } from "express";
import appConfig from "../config/env.config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (appConfig.env === "development") {
    // Safely serialize the error — Mongoose/native errors can have circular
    // references that silently crash res.json() and swallow the response entirely
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: {
        name: err.name,
        ...(err.errors && { errors: JSON.parse(JSON.stringify(err.errors, Object.getOwnPropertyNames(err.errors))) }),
      },
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({ status: err.status, message: err.message });
    } else {
      console.error("ERROR", err);
      res.status(500).json({ status: "error", message: "Something went very wrong!" });
    }
  }
};
