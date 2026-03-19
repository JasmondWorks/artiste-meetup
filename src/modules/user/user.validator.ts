import { body } from "express-validator";

export const updateUserValidator = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Must be a valid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
