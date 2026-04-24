import { Router } from "express";
import { UserController } from "./user.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { catchAsync } from "../../utils/catch-async.util";
import { updateUserValidator } from "./user.validator";
import { UserRole } from "./user.entity";

const controller = new UserController();
const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User account management (Admin only)
 */

router.use(protect);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: "**Private — Admin only.** Returns a paginated list of all user accounts."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
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
 *         description: Paginated list of users
 */
router.get(
  "/",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.getAllUsers.bind(controller)),
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: "**Private — Admin only.**"
 *     tags: [Users]
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
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.getUserById.bind(controller)),
);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update user
 *     description: "**Private — Admin only.**"
 *     tags: [Users]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [FAN, CELEBRITY, ADMIN]
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id",
  restrictTo(UserRole.ADMIN),
  updateUserValidator,
  validateRequest,
  catchAsync(controller.updateUser.bind(controller)),
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: "**Private — Admin only.**"
 *     tags: [Users]
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
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.deleteUser.bind(controller)),
);

export default router;
