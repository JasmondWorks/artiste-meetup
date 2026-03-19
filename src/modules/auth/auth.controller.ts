import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendSuccess } from "@/utils/api-response.util";
import config from "@/config/app.config";

const REFRESH_TOKEN_COOKIE = "refreshToken";

export class AuthController {
  constructor(private authService: AuthService) {}

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, tokens } = await this.authService.login(req.body);

      res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, { accessToken: tokens.accessToken, user }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, tokens } = await this.authService.register(req.body);

      res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(
        res,
        { accessToken: tokens.accessToken, user },
        "Registration successful",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  public async handleRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
      if (!refreshToken) {
        return next(new (await import("@/utils/app-error.util")).AppError("No refresh token", 401));
      }

      const { user, tokens } = await this.authService.refreshTokens(refreshToken);

      res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

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
