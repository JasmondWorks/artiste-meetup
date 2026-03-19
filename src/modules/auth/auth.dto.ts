import type { CreateUserDto as User } from "@/modules/user/user.dto";

export class LoginUserDto {
  email!: string;
  password!: string;
}

export class RegisterUserDto {
  name!: string;
  email!: string;
  password!: string;
}

export class LoginResponseDto {
  accessToken!: string;
  user!: User;
}
