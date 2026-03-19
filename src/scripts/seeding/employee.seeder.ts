import { faker } from "@faker-js/faker";
import { MongooseRepository } from "@/utils/crud.util";
import { UserRole } from "@/modules/user/user.entity";
import { IUser } from "@/modules/user/models/user.model";

export const generateEmployees = async (
  count: number,
  userRepository: MongooseRepository<IUser>,
  hashedPassword: string,
) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = await userRepository.create({
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    });

    users.push(user);
  }

  return users;
};
