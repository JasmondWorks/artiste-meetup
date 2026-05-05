import { Request, Response } from "express";
import { FanReviewService } from "./fan-review.service";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { UserRole } from "../user/user.entity";

export class FanReviewController {
  private service: FanReviewService;

  constructor() {
    this.service = new FanReviewService();
  }

  async getByCelebrity(req: Request, res: Response) {
    const result = await this.service.getReviewsByCelebrity(
      req.params.celebrityId,
      req.query as Record<string, any>,
    );
    sendSuccess(res, result, "Reviews retrieved successfully");
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    const result = await this.service.getAllReviews(req.query as Record<string, any>);
    sendSuccess(res, result, "Reviews retrieved successfully");
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    const review = await this.service.getReviewById(req.params.id);
    sendSuccess(res, review, "Review retrieved successfully");
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const review = await this.service.createReview(req.user!.id, req.body);
    sendSuccess(res, review, "Review submitted successfully", 201);
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const review = await this.service.updateReview(req.params.id, req.user!.id, req.body);
    sendSuccess(res, review, "Review updated successfully");
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    const isAdmin = !!req.user?.roles?.some((r) => r === UserRole.ADMIN);
    await this.service.deleteReview(req.params.id, req.user!.id, isAdmin);
    sendSuccess(res, null, "Review deleted successfully");
  }
}
