import { body } from "express-validator";
import { UserRole } from "../user/user.entity";

export const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(Object.values(UserRole))
    .withMessage(
      `Invalid role. Must be one of: ${Object.values(UserRole).join(", ")}`,
    ),
];

export const verifyEmailValidator = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("OTP must be a 6-digit number"),
];

export const resendOTPValidator = [
  body("email").isEmail().withMessage("A valid email is required"),
];
