import { body } from "express-validator";
import { UserRole } from "./user.entity";

export const updateUserValidator = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Must be a valid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("roles")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Roles must be a non-empty array"),
  body("roles.*")
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage(`Each role must be one of: ${Object.values(UserRole).join(", ")}`),
];
