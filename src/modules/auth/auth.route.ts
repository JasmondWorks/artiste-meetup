import { Router } from "express";
import { UserService } from "@/modules/user/user.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { validateRequest } from "@/middlewares/validate-request.middleware";
import { loginValidator, registerValidator } from "./auth.validator";

const userService = new UserService();
const authService = new AuthService(userService);
const authController = new AuthController(authService);

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post(
  "/register",
  registerValidator,
  validateRequest,
  authController.register.bind(authController),
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     security: []
 */
router.post(
  "/login",
  loginValidator,
  validateRequest,
  authController.login.bind(authController),
);

router.post("/refresh", authController.handleRefreshToken.bind(authController));

router.post("/logout", authController.logout.bind(authController));

export default router;
