import { Router } from "express";
import { CelebrityController } from "./celebrity.controller";
import { protect, restrictTo, optionalProtect } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { catchAsync } from "../../utils/catch-async.util";
import {
  createCelebrityValidator,
  updateCelebrityValidator,
  applyCelebrityValidator,
  rejectCelebrityValidator,
} from "./celebrity.validator";
import { UserRole } from "../user/user.entity";

const controller = new CelebrityController();
const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Celebrities
 *     description: Celebrity profiles — public browsing, self-application, admin management
 */

/**
 * @openapi
 * /celebrities:
 *   get:
 *     summary: Get all celebrities
 *     description: >
 *       **Public** (admins see all approval statuses; public sees only APPROVED profiles).
 *       Supports filtering by `category`, `status` (exact match) and partial
 *       text search on `name` and `interests`.
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, LIMITED, UNAVAILABLE]
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [APPROVED, PENDING, REJECTED]
 *         description: "Admin only — filter by approval status"
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
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "Comma-separated sort fields. Prefix with - for descending. Default: -createdAt"
 *     responses:
 *       200:
 *         description: Paginated list of celebrities
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCelebrityResponse'
 */
router.get("/", optionalProtect, catchAsync(controller.getAll.bind(controller)));

/**
 * @openapi
 * /celebrities/{id}:
 *   get:
 *     summary: Get celebrity by ID
 *     description: >
 *       **Public.** Returns a single celebrity profile with the linked user populated.
 *       Non-approved profiles are hidden from public — only the owner or an admin can view them.
 *     tags: [Celebrities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
router.get("/:id", optionalProtect, catchAsync(controller.getById.bind(controller)));

// All routes below require authentication
router.use(protect);

/**
 * @openapi
 * /celebrities/apply:
 *   post:
 *     summary: Apply as a celebrity
 *     description: >
 *       **Private — Any authenticated user.** Submits a celebrity profile application.
 *       The profile is created with `approvalStatus: PENDING` and is not publicly visible
 *       until an admin approves it via `PATCH /celebrities/{id}/approve`.
 *       Each user can only have one celebrity profile.
 *     tags: [Celebrities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplyCelebrityDto'
 *     responses:
 *       201:
 *         description: Application submitted — pending admin approval
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CelebrityResponse'
 *       400:
 *         description: You already have a celebrity profile
 *       401:
 *         description: Not authenticated
 */
router.post(
  "/apply",
  applyCelebrityValidator,
  validateRequest,
  catchAsync(controller.apply.bind(controller)),
);

/**
 * @openapi
 * /celebrities:
 *   post:
 *     summary: Create a celebrity profile (Admin)
 *     description: >
 *       **Private — Admin only.** Creates an admin-verified celebrity profile directly.
 *       Profile is `APPROVED` by default. Supply `userId` to link a registered user account.
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
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  "/",
  restrictTo(UserRole.ADMIN),
  createCelebrityValidator,
  validateRequest,
  catchAsync(controller.create.bind(controller)),
);

/**
 * @openapi
 * /celebrities/{id}/approve:
 *   patch:
 *     summary: Approve a celebrity application
 *     description: "**Private — Admin only.** Moves the profile from PENDING to APPROVED, making it publicly visible."
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
 *         description: Profile approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CelebrityResponse'
 *       400:
 *         description: Profile is already approved
 *       404:
 *         description: Celebrity not found
 */
router.patch(
  "/:id/approve",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.approve.bind(controller)),
);

/**
 * @openapi
 * /celebrities/{id}/reject:
 *   patch:
 *     summary: Reject a celebrity application
 *     description: "**Private — Admin only.** Rejects a PENDING profile with an optional reason."
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
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RejectCelebrityDto'
 *     responses:
 *       200:
 *         description: Profile rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CelebrityResponse'
 *       400:
 *         description: Only pending profiles can be rejected
 *       404:
 *         description: Celebrity not found
 */
router.patch(
  "/:id/reject",
  restrictTo(UserRole.ADMIN),
  rejectCelebrityValidator,
  validateRequest,
  catchAsync(controller.reject.bind(controller)),
);

/**
 * @openapi
 * /celebrities/{id}:
 *   patch:
 *     summary: Update a celebrity profile (Admin)
 *     description: "**Private — Admin only.** All fields are optional."
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
  restrictTo(UserRole.ADMIN),
  updateCelebrityValidator,
  validateRequest,
  catchAsync(controller.update.bind(controller)),
);

/**
 * @openapi
 * /celebrities/{id}:
 *   delete:
 *     summary: Delete a celebrity profile (Admin)
 *     description: "**Private — Admin only.**"
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
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.delete.bind(controller)),
);

export default router;
