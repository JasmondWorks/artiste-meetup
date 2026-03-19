import { NextFunction, Request, Response } from "express";
import { DepartmentsService } from "./departments.service";
import { sendSuccess } from "@/utils/api-response.util";

export class DepartmentsController {
  private departmentsService: DepartmentsService;

  constructor() {
    this.departmentsService = new DepartmentsService();
  }

  public async getAllDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await this.departmentsService.getAllDepartments();
      sendSuccess(res, departments, "Departments retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  public async getDepartmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const dept = await this.departmentsService.getDepartmentById(req.params.id);
      sendSuccess(res, dept, "Department retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  public async createDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const dept = await this.departmentsService.createDepartment(req.body);
      sendSuccess(res, dept, "Department created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const dept = await this.departmentsService.updateDepartment(req.params.id, req.body);
      sendSuccess(res, dept, "Department updated successfully");
    } catch (error) {
      next(error);
    }
  }

  public async deleteDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      await this.departmentsService.deleteDepartment(req.params.id);
      sendSuccess(res, null, "Department deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
