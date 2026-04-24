import { Response } from "express";
import { CelebrityService } from "./celebrity.service";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { UserRole } from "../user/user.entity";

export class CelebrityController {
  private service: CelebrityService;

  constructor() {
    this.service = new CelebrityService();
  }

  private isAdminRequest(req: AuthenticatedRequest): boolean {
    return !!req.user?.roles?.some((r) => r === UserRole.ADMIN);
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    const result = await this.service.getAllCelebrities(
      req.query as Record<string, any>,
      this.isAdminRequest(req),
    );
    sendSuccess(res, result, "Celebrities retrieved successfully");
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    const celebrity = await this.service.getCelebrityById(
      req.params.id,
      this.isAdminRequest(req),
      req.user?.id,
    );
    sendSuccess(res, celebrity, "Celebrity retrieved successfully");
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const celebrity = await this.service.createCelebrity(req.body);
    sendSuccess(res, celebrity, "Celebrity created successfully", 201);
  }

  async apply(req: AuthenticatedRequest, res: Response) {
    const celebrity = await this.service.applyAsCelebrity(req.user!.id, req.body);
    sendSuccess(res, celebrity, "Celebrity application submitted successfully", 201);
  }

  async approve(req: AuthenticatedRequest, res: Response) {
    const celebrity = await this.service.approveCelebrity(req.params.id);
    sendSuccess(res, celebrity, "Celebrity profile approved");
  }

  async reject(req: AuthenticatedRequest, res: Response) {
    const celebrity = await this.service.rejectCelebrity(req.params.id, req.body.reason);
    sendSuccess(res, celebrity, "Celebrity profile rejected");
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const celebrity = await this.service.updateCelebrity(req.params.id, req.body);
    sendSuccess(res, celebrity, "Celebrity updated successfully");
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    await this.service.deleteCelebrity(req.params.id);
    sendSuccess(res, null, "Celebrity deleted successfully");
  }
}
