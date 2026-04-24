import { NextFunction, Response } from "express";
import { FanService } from "./fan.service";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class FanController {
  private service: FanService;

  constructor() {
    this.service = new FanService();
  }

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.service.getAllFans(req.query as Record<string, any>);
      sendSuccess(res, result, "Fans retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const fan = await this.service.getFanById(req.params.id);
      sendSuccess(res, fan, "Fan retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const fan = await this.service.getFanByUserId(req.user!.id);
      sendSuccess(res, fan, "Fan profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const fan = await this.service.createFan(req.user!.id, req.body);
      sendSuccess(res, fan, "Fan profile created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const fan = await this.service.updateFanByUserId(req.user!.id, req.body);
      sendSuccess(res, fan, "Fan profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const fan = await this.service.updateFan(req.params.id, req.body);
      sendSuccess(res, fan, "Fan updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await this.service.deleteFan(req.params.id);
      sendSuccess(res, null, "Fan deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
