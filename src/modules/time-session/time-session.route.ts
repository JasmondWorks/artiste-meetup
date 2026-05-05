import { Router } from "express";
import { TimeSessionController } from "./time-session.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { catchAsync } from "../../utils/catch-async.util";
import { createTimeSessionValidator, updateTimeSessionValidator } from "./time-session.validator";
import { UserRole } from "../user/user.entity";

const controller = new TimeSessionController();
const router = Router();

/**
 * @openapi
 * tags:
 *   - name: TimeSessions
 *     description: Celebrity availability time slots
 */

/**
 * @openapi
 * /time-sessions/celebrity/{celebrityId}:
 *   get:
 *     summary: Get available slots for a celebrity
 *     description: "**Public.** Returns only unbooked time sessions for the given celebrity."
 *     tags: [TimeSessions]
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
 *         description: Paginated list of available time sessions
 */
router.get(
  "/celebrity/:celebrityId",
  catchAsync(controller.getAvailable.bind(controller)),
);

/**
 * @openapi
 * /time-sessions/{id}:
 *   get:
 *     summary: Get time session by ID
 *     description: "**Public.**"
 *     tags: [TimeSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Time session found
 *       404:
 *         description: Time session not found
 */
router.get("/:id", catchAsync(controller.getById.bind(controller)));

router.use(protect);

/**
 * @openapi
 * /time-sessions:
 *   get:
 *     summary: Get all time sessions
 *     description: "**Private — Admin only.** Returns all time sessions with optional filtering."
 *     tags: [TimeSessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: celebrityId
 *         schema:
 *           type: string
 *       - in: query
 *         name: isBooked
 *         schema:
 *           type: boolean
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
 *         description: Paginated list of time sessions
 */
router.get(
  "/",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.getAll.bind(controller)),
);

/**
 * @openapi
 * /time-sessions:
 *   post:
 *     summary: Create a time session
 *     description: "**Private — Admin only.** Creates an available time slot for a celebrity."
 *     tags: [TimeSessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTimeSessionDto'
 *     responses:
 *       201:
 *         description: Time session created
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  restrictTo(UserRole.ADMIN),
  createTimeSessionValidator,
  validateRequest,
  catchAsync(controller.create.bind(controller)),
);

/**
 * @openapi
 * /time-sessions/{id}:
 *   patch:
 *     summary: Update a time session
 *     description: "**Private — Admin only.** Cannot edit a session that is already booked."
 *     tags: [TimeSessions]
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
 *             $ref: '#/components/schemas/UpdateTimeSessionDto'
 *     responses:
 *       200:
 *         description: Time session updated
 *       400:
 *         description: Cannot edit a booked session
 *       404:
 *         description: Time session not found
 */
router.patch(
  "/:id",
  restrictTo(UserRole.ADMIN),
  updateTimeSessionValidator,
  validateRequest,
  catchAsync(controller.update.bind(controller)),
);

/**
 * @openapi
 * /time-sessions/{id}:
 *   delete:
 *     summary: Delete a time session
 *     description: "**Private — Admin only.** Cannot delete a session that is already booked."
 *     tags: [TimeSessions]
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
 *         description: Time session deleted
 *       400:
 *         description: Cannot delete a booked session
 *       404:
 *         description: Time session not found
 */
router.delete(
  "/:id",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.delete.bind(controller)),
);

export default router;
