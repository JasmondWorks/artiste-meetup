import { Router } from "express";
import { UserService } from "@/modules/user/user.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { validateRequest } from "@/middlewares/validate-request.middleware";
import {
  loginValidator,
  registerValidator,
  verifyEmailValidator,
  resendOTPValidator,
} from "./auth.validator";

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
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["CUSTOMER", "ARTISTE", "ADMIN"] 
 *     responses:
 *       201:
 *         description: >
 *           User registered successfully. A 6-digit OTP has been sent to the
 *           provided email address. No tokens are returned until the email is
 *           verified via POST /auth/verify-email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Registration successful. Please verify your email.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *       400:
 *         description: Validation error or email already in use
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 */
router.post(
  "/login",
  loginValidator,
  validateRequest,
  authController.login.bind(authController),
);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: >
 *       Reads the `refreshToken` from the **httpOnly cookie** set at login.
 *       No request body is required — the browser sends the cookie automatically.
 *       Returns a new access token and rotates the refresh token cookie.
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Missing or invalid refresh token cookie
 */
router.post("/refresh", authController.handleRefreshToken.bind(authController));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/logout", authController.logout.bind(authController));

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: Verify email with OTP
 *     description: >
 *       Submits the 6-digit OTP sent to the user's email during registration (or
 *       after a resend request). On success, marks the email as verified, issues
 *       an access token in the response body, and sets the refresh token as an
 *       httpOnly cookie. This is the only way to receive auth tokens after
 *       registration.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "482916"
 *     responses:
 *       200:
 *         description: >
 *           Email verified. Returns access token in body; refresh token is set
 *           as an httpOnly cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Email verified successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     user:
 *                       type: object
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post(
  "/verify-email",
  verifyEmailValidator,
  validateRequest,
  authController.verifyEmail.bind(authController),
);

/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification OTP
 *     description: >
 *       Generates a fresh 6-digit OTP and sends it to the provided email address.
 *       Any previously issued OTP is invalidated. Only works for accounts whose
 *       email has not yet been verified. Attempting to resend for an already-verified
 *       account returns a 400 error.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: A new verification OTP has been sent to your email.
 *       400:
 *         description: Email already verified
 *       404:
 *         description: User not found
 */
router.post(
  "/resend-verification",
  resendOTPValidator,
  validateRequest,
  authController.resendVerificationOTP.bind(authController),
);

export default router;
