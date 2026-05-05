import { Response } from "express";
import { DashboardService } from "./dashboard.service";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class DashboardController {
  private service: DashboardService;

  constructor() {
    this.service = new DashboardService();
  }

  async getStats(req: AuthenticatedRequest, res: Response) {
    const stats = await this.service.getStats();
    sendSuccess(res, stats, "Dashboard statistics retrieved successfully");
  }
}
