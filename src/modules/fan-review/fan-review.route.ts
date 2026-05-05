import { Router } from "express";
import { FanReviewController } from "./fan-review.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { catchAsync } from "../../utils/catch-async.util";
import { createFanReviewValidator, updateFanReviewValidator } from "./fan-review.validator";
import { UserRole } from "../user/user.entity";

const controller = new FanReviewController();
const router = Router();

/**
 * @openapi
 * tags:
 *   - name: FanReviews
 *     description: Fan ratings and reviews for celebrities
 */

/**
 * @openapi
 * /reviews/celebrity/{celebrityId}:
 *   get:
 *     summary: Get reviews for a celebrity
 *     description: "**Public.** Returns all reviews for a specific celebrity."
 *     tags: [FanReviews]
 *     parameters:
 *       - in: path
 *         name: celebrityId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of reviews
 */
router.get("/celebrity/:celebrityId", catchAsync(controller.getByCelebrity.bind(controller)));

router.use(protect);

/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: Submit a review
 *     description: "**Private — Any authenticated user.** One review per fan per celebrity."
 *     tags: [FanReviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFanReviewDto'
 *     responses:
 *       201:
 *         description: Review submitted
 *       400:
 *         description: Already reviewed this celebrity
 */
router.post(
  "/",
  createFanReviewValidator,
  validateRequest,
  catchAsync(controller.create.bind(controller)),
);

/**
 * @openapi
 * /reviews/{id}:
 *   patch:
 *     summary: Update your review
 *     description: "**Private — Review owner only.**"
 *     tags: [FanReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFanReviewDto'
 *     responses:
 *       200:
 *         description: Review updated
 *       403:
 *         description: Not your review
 */
router.patch(
  "/:id",
  updateFanReviewValidator,
  validateRequest,
  catchAsync(controller.update.bind(controller)),
);

/**
 * @openapi
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: "**Private — Review owner or Admin.**"
 *     tags: [FanReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       403:
 *         description: Not your review
 */
router.delete("/:id", catchAsync(controller.delete.bind(controller)));

/**
 * @openapi
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: "**Private — Admin only.**"
 *     tags: [FanReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of all reviews
 */
router.get("/", restrictTo(UserRole.ADMIN), catchAsync(controller.getAll.bind(controller)));

/**
 * @openapi
 * /reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     description: "**Private — Admin only.**"
 *     tags: [FanReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 */
router.get("/:id", restrictTo(UserRole.ADMIN), catchAsync(controller.getById.bind(controller)));

export default router;
