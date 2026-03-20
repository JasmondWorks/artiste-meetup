import { MongooseRepository } from "../../utils/crud.util";
import { IUser } from "../../modules/user/user.model";

interface DepartmentTemplate {
  name: string;
  designations: string[];
  description: string;
}

// TODO: implement once the departments module is added
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateDepartment = async (
  template: DepartmentTemplate,
  users: IUser[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  departmentRepository: MongooseRepository<any>,
) => {
  return departmentRepository.create({
    name: template.name,
    designations: template.designations,
    description: template.description,
  });
};
