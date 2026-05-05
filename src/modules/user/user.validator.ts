import { body } from "express-validator";
import { UserRole } from "./user.entity";

export const updateMyProfileValidator = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("phoneNumber").optional().isString().withMessage("Phone number must be a string"),
  body("country").optional().isString().withMessage("Country must be a string"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("profilePicture").optional().isURL().withMessage("Profile picture must be a valid URL"),
];

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
  body("phoneNumber").optional().isString().withMessage("Phone number must be a string"),
  body("country").optional().isString().withMessage("Country must be a string"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("profilePicture").optional().isURL().withMessage("Profile picture must be a valid URL"),
];
