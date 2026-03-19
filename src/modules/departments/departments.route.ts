import { Router } from "express";
import { DepartmentsController } from "./departments.controller";
import { protect, restrictTo } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate-request.middleware";
import {
  createDepartmentValidator,
  updateDepartmentValidator,
} from "./departments.validator";
import { UserRole } from "@/modules/user/user.entity";

const controller = new DepartmentsController();
const router = Router();

router.use(protect);

/**
 * @openapi
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get(
  "/",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  controller.getAllDepartments.bind(controller),
);

router.get(
  "/:id",
  restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  controller.getDepartmentById.bind(controller),
);

router.post(
  "/",
  restrictTo(UserRole.SUPER_ADMIN),
  createDepartmentValidator,
  validateRequest,
  controller.createDepartment.bind(controller),
);

router.put(
  "/:id",
  restrictTo(UserRole.SUPER_ADMIN),
  updateDepartmentValidator,
  validateRequest,
  controller.updateDepartment.bind(controller),
);

router.delete(
  "/:id",
  restrictTo(UserRole.SUPER_ADMIN),
  controller.deleteDepartment.bind(controller),
);

export default router;
