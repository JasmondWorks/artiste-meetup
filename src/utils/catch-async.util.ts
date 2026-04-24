import { NextFunction, Request, Response } from "express";

/**
 * Wraps an async route handler and forwards any rejection to Express's next()
 * error handler, eliminating repetitive try/catch boilerplate in controllers.
 *
 * Usage:
 *   router.get("/", catchAsync(async (req, res) => { ... }));
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
