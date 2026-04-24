import { Router } from "express";
import { CelebrityController } from "./celebrity.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { createCelebrityValidator, updateCelebrityValidator } from "./celebrity.validator";
import { UserRole } from "../user/user.entity";

const controller = new CelebrityController();
const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Celebrities
 *     description: Celebrity profiles — public browsing, admin management
 */

/**
 * @openapi
 * /celebrities:
 *   get:
 *     summary: Get all celebrities
 *     description: >
 *       Public endpoint. Returns a paginated list of celebrity profiles.
 *       Supports filtering by category and status (exact match), and partial
 *       text search on name and interests via dedicated query params.
 *     tags: [Celebrities]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partial case-insensitive name search
 *       - in: query
 *         name: interest
 *         schema:
 *           type: string
 *         description: Partial case-insensitive keyword search against interests array
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [MUSIC_ARTISTE, FILM_ACTOR, PROFESSIONAL_ATHLETE, TECH_ENTREPRENEUR]
 *         description: Exact match filter by celebrity category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, LIMITED, UNAVAILABLE]
 *         description: Exact match filter by availability status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "Sort fields (comma-separated). Prefix with - for descending. Default: -createdAt"
 *     responses:
 *       200:
 *         description: Paginated list of celebrities
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCelebrityResponse'
 */
router.get("/", controller.getAll.bind(controller));

/**
 * @openapi
 * /celebrities/{id}:
 *   get:
 *     summary: Get celebrity by ID
 *     description: Public endpoint. Returns a single celebrity profile with linked user populated.
 *     tags: [Celebrities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Celebrity MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Celebrity found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CelebrityResponse'
 *       404:
 *         description: Celebrity not found
 */
router.get("/:id", controller.getById.bind(controller));

router.use(protect);

/**
 * @openapi
 * /celebrities:
 *   post:
 *     summary: Create a celebrity profile
 *     description: >
 *       **Private — Admin/Super Admin only.**
 *       Creates a new celebrity profile. The `userId` field is optional; supply it
 *       when the celebrity is also a registered user on the platform.
 *     tags: [Celebrities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCelebrityDto'
 *     responses:
 *       201:
 *         description: Celebrity created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CelebrityResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  "/",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  createCelebrityValidator,
  validateRequest,
  controller.create.bind(controller),
);

/**
 * @openapi
 * /celebrities/{id}:
 *   patch:
 *     summary: Update a celebrity profile
 *     description: "**Private — Admin/Super Admin only.** All fields are optional."
 *     tags: [Celebrities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCelebrityDto'
 *     responses:
 *       200:
 *         description: Celebrity updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CelebrityResponse'
 *       404:
 *         description: Celebrity not found
 */
router.patch(
  "/:id",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  updateCelebrityValidator,
  validateRequest,
  controller.update.bind(controller),
);

/**
 * @openapi
 * /celebrities/{id}:
 *   delete:
 *     summary: Delete a celebrity profile
 *     description: "**Private — Admin/Super Admin only.**"
 *     tags: [Celebrities]
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
 *         description: Celebrity deleted
 *       404:
 *         description: Celebrity not found
 */
router.delete(
  "/:id",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  controller.delete.bind(controller),
);

export default router;
