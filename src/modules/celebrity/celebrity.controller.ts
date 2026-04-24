import { NextFunction, Request, Response } from "express";
import { CelebrityService } from "./celebrity.service";
import { sendSuccess } from "../../utils/api-response.util";

export class CelebrityController {
  private service: CelebrityService;

  constructor() {
    this.service = new CelebrityService();
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.getAllCelebrities(req.query as Record<string, any>);
      sendSuccess(res, result, "Celebrities retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const celebrity = await this.service.getCelebrityById(req.params.id);
      sendSuccess(res, celebrity, "Celebrity retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const celebrity = await this.service.createCelebrity(req.body);
      sendSuccess(res, celebrity, "Celebrity created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const celebrity = await this.service.updateCelebrity(req.params.id, req.body);
      sendSuccess(res, celebrity, "Celebrity updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.deleteCelebrity(req.params.id);
      sendSuccess(res, null, "Celebrity deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
