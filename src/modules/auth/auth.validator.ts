import { body } from "express-validator";
import { UserRole } from "../user/user.entity";

export const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Shared base rules for all self-registration endpoints
export const baseRegisterValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// POST /auth/register/fan — roles injected server-side, no roles field in body
export const registerFanValidator = [...baseRegisterValidator];

// POST /auth/register/celebrity — roles injected server-side, no roles field in body
export const registerCelebrityValidator = [...baseRegisterValidator];

// POST /auth/register/admin — roles injected server-side; endpoint is admin-protected
export const registerAdminValidator = [...baseRegisterValidator];

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
