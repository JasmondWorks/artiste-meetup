import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { catchAsync } from "../../utils/catch-async.util";
import { UserRole } from "../user/user.entity";

const controller = new DashboardController();
const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Dashboard
 *     description: Platform-wide statistics for admins
 *
 * components:
 *   schemas:
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         statusCode:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             bookings:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 pending:
 *                   type: integer
 *                 confirmed:
 *                   type: integer
 *                 rejected:
 *                   type: integer
 *                 cancelled:
 *                   type: integer
 *             chats:
 *               type: object
 *               properties:
 *                 active:
 *                   type: integer
 *                 recentActive:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatObject'
 */

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: >
 *       **Private — Admin only.**
 *       Returns aggregated platform stats: total/pending/confirmed/rejected/cancelled
 *       bookings and active chat count with recent active chat details.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 */
router.get(
  "/",
  protect,
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.getStats.bind(controller)),
);

export default router;
