import { Router } from "express";
import { ChatController } from "./chat.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { catchAsync } from "../../utils/catch-async.util";
import { createChatValidator, updateChatValidator } from "./chat.validator";
import { UserRole } from "../user/user.entity";

const controller = new ChatController();
const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Chats
 *     description: Telegram chat integration records
 */

router.use(protect);

/**
 * @openapi
 * /chats/my:
 *   get:
 *     summary: Get my chats
 *     description: "**Private — Any authenticated user.** Returns chats where the current user is the fan."
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
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
 *         description: List of your chats
 */
router.get("/my", catchAsync(controller.getMyChats.bind(controller)));

/**
 * @openapi
 * /chats:
 *   get:
 *     summary: Get all chats
 *     description: "**Private — Admin only.**"
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
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
 *         description: Paginated list of all chats
 */
router.get("/", restrictTo(UserRole.ADMIN), catchAsync(controller.getAll.bind(controller)));

/**
 * @openapi
 * /chats/{id}:
 *   get:
 *     summary: Get chat by ID
 *     description: "**Private — Admin only.**"
 *     tags: [Chats]
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
 *         description: Chat found
 *       404:
 *         description: Chat not found
 */
router.get("/:id", restrictTo(UserRole.ADMIN), catchAsync(controller.getById.bind(controller)));

/**
 * @openapi
 * /chats:
 *   post:
 *     summary: Create a chat manually
 *     description: >
 *       **Private — Admin only.** Manually creates a chat record.
 *       Chats are also auto-created when a booking with a `telegramUsername` is confirmed.
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChatDto'
 *     responses:
 *       201:
 *         description: Chat created
 */
router.post(
  "/",
  restrictTo(UserRole.ADMIN),
  createChatValidator,
  validateRequest,
  catchAsync(controller.create.bind(controller)),
);

/**
 * @openapi
 * /chats/{id}:
 *   patch:
 *     summary: Update chat status or telegram username
 *     description: "**Private — Admin only.**"
 *     tags: [Chats]
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
 *             $ref: '#/components/schemas/UpdateChatDto'
 *     responses:
 *       200:
 *         description: Chat updated
 */
router.patch(
  "/:id",
  restrictTo(UserRole.ADMIN),
  updateChatValidator,
  validateRequest,
  catchAsync(controller.update.bind(controller)),
);

/**
 * @openapi
 * /chats/{id}:
 *   delete:
 *     summary: Delete a chat
 *     description: "**Private — Admin only.**"
 *     tags: [Chats]
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
 *         description: Chat deleted
 */
router.delete(
  "/:id",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.delete.bind(controller)),
);

export default router;
