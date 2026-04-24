import { Response } from "express";
import { FanService } from "./fan.service";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class FanController {
  private service: FanService;

  constructor() {
    this.service = new FanService();
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    const result = await this.service.getAllFans(req.query as Record<string, any>);
    sendSuccess(res, result, "Fans retrieved successfully");
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    const fan = await this.service.getFanById(req.params.id);
    sendSuccess(res, fan, "Fan retrieved successfully");
  }

  async getMyProfile(req: AuthenticatedRequest, res: Response) {
    const fan = await this.service.getFanByUserId(req.user!.id);
    sendSuccess(res, fan, "Fan profile retrieved successfully");
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const fan = await this.service.createFan(req.user!.id, req.body);
    sendSuccess(res, fan, "Fan profile created successfully", 201);
  }

  async updateMyProfile(req: AuthenticatedRequest, res: Response) {
    const fan = await this.service.updateFanByUserId(req.user!.id, req.body);
    sendSuccess(res, fan, "Fan profile updated successfully");
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const fan = await this.service.updateFan(req.params.id, req.body);
    sendSuccess(res, fan, "Fan updated successfully");
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    await this.service.deleteFan(req.params.id);
    sendSuccess(res, null, "Fan deleted successfully");
  }
}
