import { MongooseRepository } from "@/utils/crud.util";
import { AppError } from "@/utils/app-error.util";
import { DepartmentModel, IDepartment } from "./department.model";

export class DepartmentsService {
  private repo: MongooseRepository<IDepartment>;

  constructor() {
    this.repo = new MongooseRepository(DepartmentModel);
  }

  async getAllDepartments() {
    return this.repo.findAll();
  }

  async getDepartmentById(id: string) {
    const dept = await this.repo.findById(id);
    if (!dept) throw new AppError("Department not found", 404);
    return dept;
  }

  async createDepartment(data: Partial<IDepartment>) {
    const existing = await this.repo.findOne({ name: data.name });
    if (existing) throw new AppError("Department already exists", 400);
    return this.repo.create(data);
  }

  async updateDepartment(id: string, data: Partial<IDepartment>) {
    const dept = await this.repo.findById(id);
    if (!dept) throw new AppError("Department not found", 404);
    return this.repo.update(id, data);
  }

  async deleteDepartment(id: string) {
    const dept = await this.repo.findById(id);
    if (!dept) throw new AppError("Department not found", 404);
    return this.repo.delete(id);
  }
}
