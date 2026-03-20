import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendSuccess } from "../../utils/api-response.util";
import { AppError } from "../../utils/app-error.util";
import config from "../../config/env.config";

const REFRESH_TOKEN_COOKIE = "refreshToken";

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export class AuthController {
  constructor(private authService: AuthService) {}

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = await this.authService.register(req.body);
      sendSuccess(
        res,
        { user },
        "Registration successful. Check your email for a 6-digit OTP.",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, tokens, isFirstLogin } = await this.authService.login(req.body);

      setRefreshCookie(res, tokens.refreshToken);
      sendSuccess(res, { accessToken: tokens.accessToken, isFirstLogin, user }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, tokens, isFirstLogin } = await this.authService.verifyEmail(req.body);

      setRefreshCookie(res, tokens.refreshToken);
      sendSuccess(
        res,
        { accessToken: tokens.accessToken, isFirstLogin, user },
        "Email verified successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  public async resendVerificationOTP(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.resendVerificationOTP(req.body.email);
      sendSuccess(res, null, "A new OTP has been sent to your email");
    } catch (error) {
      next(error);
    }
  }

  public async handleRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
      if (!refreshToken) {
        return next(new AppError("No refresh token", 401));
      }

      const { user, tokens } = await this.authService.refreshTokens(refreshToken);

      setRefreshCookie(res, tokens.refreshToken);
      sendSuccess(res, { accessToken: tokens.accessToken, user }, "Token refreshed");
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie(REFRESH_TOKEN_COOKIE);
      sendSuccess(res, null, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }
}
