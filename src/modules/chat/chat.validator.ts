import { body } from "express-validator";
import { ChatStatus } from "./chat.entity";

export const createChatValidator = [
  body("fanId").notEmpty().isMongoId().withMessage("Valid fan ID is required"),
  body("celebrityId").notEmpty().isMongoId().withMessage("Valid celebrity ID is required"),
  body("bookingId").optional().isMongoId().withMessage("Booking ID must be a valid ObjectId"),
  body("telegramUsername").notEmpty().isString().withMessage("Telegram username is required"),
];

export const updateChatValidator = [
  body("status")
    .optional()
    .isIn(Object.values(ChatStatus))
    .withMessage(`Status must be one of: ${Object.values(ChatStatus).join(", ")}`),
  body("telegramUsername")
    .optional()
    .notEmpty()
    .withMessage("Telegram username cannot be empty"),
];
