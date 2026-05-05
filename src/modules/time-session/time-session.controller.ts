import { Request, Response } from "express";
import { TimeSessionService } from "./time-session.service";
import { sendSuccess } from "../../utils/api-response.util";

export class TimeSessionController {
  private service: TimeSessionService;

  constructor() {
    this.service = new TimeSessionService();
  }

  async getAll(req: Request, res: Response) {
    const result = await this.service.getAllTimeSessions(req.query as Record<string, any>);
    sendSuccess(res, result, "Time sessions retrieved successfully");
  }

  async getAvailable(req: Request, res: Response) {
    const { celebrityId } = req.params;
    const result = await this.service.getAvailableTimeSessions(
      celebrityId,
      req.query as Record<string, any>,
    );
    sendSuccess(res, result, "Available time sessions retrieved successfully");
  }

  async getById(req: Request, res: Response) {
    const session = await this.service.getTimeSessionById(req.params.id);
    sendSuccess(res, session, "Time session retrieved successfully");
  }

  async create(req: Request, res: Response) {
    const session = await this.service.createTimeSession(req.body);
    sendSuccess(res, session, "Time session created successfully", 201);
  }

  async update(req: Request, res: Response) {
    const session = await this.service.updateTimeSession(req.params.id, req.body);
    sendSuccess(res, session, "Time session updated successfully");
  }

  async delete(req: Request, res: Response) {
    await this.service.deleteTimeSession(req.params.id);
    sendSuccess(res, null, "Time session deleted successfully");
  }
}
