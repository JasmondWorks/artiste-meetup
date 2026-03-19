import bcrypt from "bcrypt";
import appConfig from "@/config/app.config";
import { MongooseRepository } from "@/utils/crud.util";
import { UserRole } from "@/modules/user/user.entity";
import User, { IUser } from "@/modules/user/models/user.model";

export const generateSuperAdmin = async (
  userRepository: MongooseRepository<IUser>,
) => {
  const existing = await userRepository.findOne({ email: appConfig.superAdmin.email });

  if (!existing) {
    const admin = await userRepository.create({
      name: "Super Admin",
      email: appConfig.superAdmin.email,
      password: await bcrypt.hash(appConfig.superAdmin.password, 12),
      role: UserRole.SUPER_ADMIN,
    });

    console.log("Super admin created");
    return admin;
  }

  console.log("Super admin already exists");
  return existing;
};

// Run directly: npm run seedAdmin
if (require.main === module) {
  (async () => {
    const connectToDatabase = (await import("@/config/db.config")).default;
    await connectToDatabase();
    const repo = new MongooseRepository<IUser>(User);
    await generateSuperAdmin(repo);
    process.exit(0);
  })();
}
