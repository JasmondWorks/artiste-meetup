import { UserRole } from "./user.entity";

export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  roles!: UserRole[];
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  roles?: UserRole[];
}
