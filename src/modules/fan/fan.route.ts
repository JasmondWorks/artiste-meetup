import { Router } from "express";
import { FanController } from "./fan.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { catchAsync } from "../../utils/catch-async.util";
import { createFanValidator, updateFanValidator } from "./fan.validator";
import { UserRole } from "../user/user.entity";

const controller = new FanController();
const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Fans
 *     description: Fan profile management
 */

router.use(protect);

/**
 * @openapi
 * /fans/me:
 *   get:
 *     summary: Get my fan profile
 *     description: "**Private — Any authenticated user.** Returns the fan profile linked to the current user."
 *     tags: [Fans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fan profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FanResponse'
 *       404:
 *         description: Fan profile not found
 */
router.get("/me", catchAsync(controller.getMyProfile.bind(controller)));

/**
 * @openapi
 * /fans:
 *   post:
 *     summary: Create fan profile
 *     description: >
 *       **Private — Any authenticated user.**
 *       Creates a fan profile linked to the current user. Each user can only have one fan profile.
 *     tags: [Fans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFanDto'
 *     responses:
 *       201:
 *         description: Fan profile created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FanResponse'
 *       400:
 *         description: Fan profile already exists for this user
 */
router.post(
  "/",
  createFanValidator,
  validateRequest,
  catchAsync(controller.create.bind(controller)),
);

/**
 * @openapi
 * /fans/me:
 *   patch:
 *     summary: Update my fan profile
 *     description: "**Private — Any authenticated user.**"
 *     tags: [Fans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFanDto'
 *     responses:
 *       200:
 *         description: Fan profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FanResponse'
 *       404:
 *         description: Fan profile not found
 */
router.patch(
  "/me",
  updateFanValidator,
  validateRequest,
  catchAsync(controller.updateMyProfile.bind(controller)),
);

/**
 * @openapi
 * /fans:
 *   get:
 *     summary: Get all fan profiles
 *     description: "**Private — Admin only.** Returns a paginated list of all fan profiles with user data populated."
 *     tags: [Fans]
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
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "Comma-separated sort fields. Prefix with - for descending. Default: -createdAt"
 *     responses:
 *       200:
 *         description: Paginated list of fans
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedFanResponse'
 */
router.get(
  "/",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.getAll.bind(controller)),
);

/**
 * @openapi
 * /fans/{id}:
 *   get:
 *     summary: Get fan by ID
 *     description: "**Private — Admin only.**"
 *     tags: [Fans]
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
 *         description: Fan found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FanResponse'
 *       404:
 *         description: Fan not found
 */
router.get(
  "/:id",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.getById.bind(controller)),
);

/**
 * @openapi
 * /fans/{id}:
 *   patch:
 *     summary: Update fan by ID
 *     description: "**Private — Admin only.**"
 *     tags: [Fans]
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
 *             $ref: '#/components/schemas/UpdateFanDto'
 *     responses:
 *       200:
 *         description: Fan updated
 *       404:
 *         description: Fan not found
 */
router.patch(
  "/:id",
  restrictTo(UserRole.ADMIN),
  updateFanValidator,
  validateRequest,
  catchAsync(controller.update.bind(controller)),
);

/**
 * @openapi
 * /fans/{id}:
 *   delete:
 *     summary: Delete fan by ID
 *     description: "**Private — Admin only.**"
 *     tags: [Fans]
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
 *         description: Fan deleted
 *       404:
 *         description: Fan not found
 */
router.delete(
  "/:id",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.delete.bind(controller)),
);

export default router;
