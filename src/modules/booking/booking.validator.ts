import { body } from "express-validator";

export const createBookingValidator = [
  body("celebrityId").notEmpty().isMongoId().withMessage("Valid celebrity ID is required"),
  body("timeSessionId").notEmpty().isMongoId().withMessage("Valid time session ID is required"),
  body("message").optional().isString().withMessage("Message must be a string"),
  body("telegramUsername")
    .optional()
    .isString()
    .withMessage("Telegram username must be a string"),
];
