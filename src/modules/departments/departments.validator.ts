import { body } from "express-validator";

export const createDepartmentValidator = [
  body("name").notEmpty().withMessage("Department name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("designations")
    .isArray({ min: 1 })
    .withMessage("At least one designation is required"),
];

export const updateDepartmentValidator = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("description").optional().notEmpty().withMessage("Description cannot be empty"),
  body("designations").optional().isArray().withMessage("Must be an array"),
];
