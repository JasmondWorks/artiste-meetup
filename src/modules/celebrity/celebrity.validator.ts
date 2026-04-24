import { body } from "express-validator";
import { CelebrityCategory, CelebrityStatus } from "./celebrity.entity";

export const createCelebrityValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("profession").notEmpty().withMessage("Profession is required"),
  body("category")
    .notEmpty()
    .isIn(Object.values(CelebrityCategory))
    .withMessage(`Category must be one of: ${Object.values(CelebrityCategory).join(", ")}`),
  body("bookingPrice")
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("Booking price must be a non-negative number"),
  body("status")
    .optional()
    .isIn(Object.values(CelebrityStatus))
    .withMessage(`Status must be one of: ${Object.values(CelebrityStatus).join(", ")}`),
  body("userId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("interests").optional().isArray().withMessage("Interests must be an array"),
  body("interests.*").optional().isString().withMessage("Each interest must be a string"),
];

export const updateCelebrityValidator = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("profession").optional().notEmpty().withMessage("Profession cannot be empty"),
  body("category")
    .optional()
    .isIn(Object.values(CelebrityCategory))
    .withMessage(`Category must be one of: ${Object.values(CelebrityCategory).join(", ")}`),
  body("bookingPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Booking price must be a non-negative number"),
  body("status")
    .optional()
    .isIn(Object.values(CelebrityStatus))
    .withMessage(`Status must be one of: ${Object.values(CelebrityStatus).join(", ")}`),
  body("userId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("interests").optional().isArray().withMessage("Interests must be an array"),
  body("interests.*").optional().isString().withMessage("Each interest must be a string"),
];
