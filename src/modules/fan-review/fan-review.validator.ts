import { body } from "express-validator";

export const createFanReviewValidator = [
  body("celebrityId").notEmpty().isMongoId().withMessage("Valid celebrity ID is required"),
  body("bookingId").optional().isMongoId().withMessage("Booking ID must be a valid ObjectId"),
  body("rating")
    .notEmpty()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("comment").optional().isString().withMessage("Comment must be a string"),
];

export const updateFanReviewValidator = [
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("comment").optional().isString().withMessage("Comment must be a string"),
];
