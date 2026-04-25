import { Router } from "express";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { catchAsync } from "../../utils/catch-async.util";
import {
  loginValidator,
  registerFanValidator,
  registerCelebrityValidator,
  verifyEmailValidator,
  resendOTPValidator,
} from "./auth.validator";

const userService = new UserService();
const authService = new AuthService(userService);
const authController = new AuthController(authService);

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication — registration, login, email verification, token management
 */

/**
 * @openapi
 * /auth/register/fan:
 *   post:
 *     summary: Register as a Fan
 *     description: >
 *       **Public.** Creates a new user account with the `FAN` role.
 *       A 6-digit OTP is emailed for verification. No tokens are returned
 *       until the email is verified via `POST /auth/verify-email`.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: Registration successful — OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation error or email already in use
 */
router.post(
  "/register/fan",
  registerFanValidator,
  validateRequest,
  catchAsync(authController.registerFan.bind(authController)),
);

/**
 * @openapi
 * /auth/register/celebrity:
 *   post:
 *     summary: Register as a Celebrity
 *     description: >
 *       **Public.** Creates a new user account with the `CELEBRITY` role.
 *       A 6-digit OTP is emailed for verification. After verifying your email,
 *       submit your celebrity profile via `POST /celebrities/apply` to go through
 *       admin approval before your profile is publicly visible.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: Registration successful — OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation error or email already in use
 */
router.post(
  "/register/celebrity",
  registerCelebrityValidator,
  validateRequest,
  catchAsync(authController.registerCelebrity.bind(authController)),
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: >
 *       **Public.** Authenticates the user. Returns both tokens in the response
 *       body (`accessToken`, `refreshToken`) **and** sets the refresh token as an
 *       httpOnly cookie. Works for all roles.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful — both tokens returned in body; refresh token also set as httpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified (fresh OTP auto-sent)
 */
router.post(
  "/login",
  loginValidator,
  validateRequest,
  catchAsync(authController.login.bind(authController)),
);

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: Verify email with OTP
 *     description: >
 *       **Public.** Submits the 6-digit OTP sent to the user's email.
 *       On success, issues both tokens in the response body (`accessToken`,
 *       `refreshToken`) **and** sets the refresh token as an httpOnly cookie.
 *       This is the only path to receive auth tokens after registration.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailDto'
 *     responses:
 *       200:
 *         description: Email verified — both tokens returned in body; refresh token also set as httpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post(
  "/verify-email",
  verifyEmailValidator,
  validateRequest,
  catchAsync(authController.verifyEmail.bind(authController)),
);

/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification OTP
 *     description: >
 *       **Public.** Generates a fresh OTP and emails it. Any prior OTP is
 *       invalidated. Only works for unverified accounts.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOTPDto'
 *     responses:
 *       200:
 *         description: New OTP sent
 *       400:
 *         description: Email already verified
 *       404:
 *         description: User not found
 */
router.post(
  "/resend-verification",
  resendOTPValidator,
  validateRequest,
  catchAsync(authController.resendVerificationOTP.bind(authController)),
);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: >
 *       **Public.** Accepts the refresh token either as a JSON body field
 *       (`refreshToken`) **or** from the `refreshToken` httpOnly cookie set at
 *       login — whichever is present. Body takes precedence over the cookie.
 *       Returns a new rotated `accessToken` and `refreshToken` in the response
 *       body, and also rotates the cookie.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenDto'
 *     responses:
 *       200:
 *         description: Tokens rotated — both returned in body; refresh token cookie also updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 *       401:
 *         description: No refresh token provided, or token is invalid / expired
 */
router.post("/refresh", catchAsync(authController.handleRefreshToken.bind(authController)));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     description: "**Public.** Clears the refresh token cookie."
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", catchAsync(authController.logout.bind(authController)));

export default router;
