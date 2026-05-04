import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendSuccess } from "../../utils/api-response.util";
import { AppError } from "../../utils/app-error.util";
import config from "../../config/env.config";
import { UserRole } from "../user/user.entity";

const REFRESH_TOKEN_COOKIE = "refreshToken";

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export class AuthController {
  constructor(private authService: AuthService) {}

  public async registerFan(req: Request, res: Response) {
    const { user } = await this.authService.register({
      ...req.body,
      roles: [UserRole.FAN],
    });
    sendSuccess(
      res,
      { user },
      "Fan registration successful. Check your email for a 6-digit OTP.",
      201,
    );
  }

  public async registerCelebrity(req: Request, res: Response) {
    const { user } = await this.authService.register({
      ...req.body,
      roles: [UserRole.CELEBRITY],
    });
    sendSuccess(
      res,
      { user },
      "Celebrity registration successful. Check your email for a 6-digit OTP.",
      201,
    );
  }

  public async registerAdmin(req: Request, res: Response) {
    const { user } = await this.authService.register({
      ...req.body,
      roles: [UserRole.ADMIN],
    });
    sendSuccess(
      res,
      { user },
      "Admin registered successfully. Check email for a 6-digit OTP.",
      201,
    );
  }

  public async login(req: Request, res: Response) {
    const { user, tokens, isFirstLogin } = await this.authService.login(req.body);
    setRefreshCookie(res, tokens.refreshToken);
    sendSuccess(
      res,
      { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, isFirstLogin, user },
      "Login successful",
    );
  }

  public async verifyEmail(req: Request, res: Response) {
    const { user, tokens, isFirstLogin } = await this.authService.verifyEmail(req.body);
    setRefreshCookie(res, tokens.refreshToken);
    sendSuccess(
      res,
      { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, isFirstLogin, user },
      "Email verified successfully",
    );
  }

  public async resendVerificationOTP(req: Request, res: Response) {
    await this.authService.resendVerificationOTP(req.body.email);
    sendSuccess(res, null, "A new OTP has been sent to your email");
  }

  public async handleRefreshToken(req: Request, res: Response, next: NextFunction) {
    // Body takes precedence; cookie is the fallback (supports both clients and browsers)
    const refreshToken = req.body?.refreshToken ?? req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      return next(new AppError("No refresh token provided", 401));
    }
    const { user, tokens } = await this.authService.refreshTokens(refreshToken);
    setRefreshCookie(res, tokens.refreshToken);
    sendSuccess(
      res,
      { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user },
      "Token refreshed",
    );
  }

  public async logout(req: Request, res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE);
    sendSuccess(res, null, "Logged out successfully");
  }
}
