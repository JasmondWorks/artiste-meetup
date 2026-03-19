import { Router } from "express";
import { UserController } from "./user.controller";
import { protect, restrictTo } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate-request.middleware";
import { updateUserValidator } from "./user.validator";
import { UserRole } from "./user.entity";

const controller = new UserController();
const router = Router();

router.use(protect);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  "/",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  controller.getAllUsers.bind(controller),
);

router.get(
  "/:id",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  controller.getUserById.bind(controller),
);

router.put(
  "/:id",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  updateUserValidator,
  validateRequest,
  controller.updateUser.bind(controller),
);

router.delete(
  "/:id",
  restrictTo(UserRole.SUPER_ADMIN),
  controller.deleteUser.bind(controller),
);

export default router;
