import { body } from "express-validator";

export const createFanValidator = [
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("interests").optional().isArray().withMessage("Interests must be an array"),
  body("interests.*").optional().isString().withMessage("Each interest must be a string"),
];

export const updateFanValidator = [
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("interests").optional().isArray().withMessage("Interests must be an array"),
  body("interests.*").optional().isString().withMessage("Each interest must be a string"),
];
