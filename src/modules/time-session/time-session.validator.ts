import { body } from "express-validator";

export const createTimeSessionValidator = [
  body("celebrityId").notEmpty().isMongoId().withMessage("Valid celebrity ID is required"),
  body("date").notEmpty().isISO8601().withMessage("Date must be a valid ISO 8601 date"),
  body("startTime")
    .notEmpty()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Start time must be in HH:MM format"),
  body("endTime")
    .notEmpty()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("End time must be in HH:MM format"),
];

export const updateTimeSessionValidator = [
  body("date").optional().isISO8601().withMessage("Date must be a valid ISO 8601 date"),
  body("startTime")
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Start time must be in HH:MM format"),
  body("endTime")
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("End time must be in HH:MM format"),
];
