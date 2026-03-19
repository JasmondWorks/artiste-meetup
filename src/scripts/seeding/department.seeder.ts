import { MongooseRepository } from "@/utils/crud.util";
import { IDepartment } from "@/modules/departments/department.model";
import { IUser } from "@/modules/user/models/user.model";

interface DepartmentTemplate {
  name: string;
  designations: string[];
  description: string;
}

export const generateDepartment = async (
  template: DepartmentTemplate,
  users: IUser[],
  departmentRepository: MongooseRepository<IDepartment>,
) => {
  return departmentRepository.create({
    name: template.name,
    designations: template.designations,
    description: template.description,
  });
};
