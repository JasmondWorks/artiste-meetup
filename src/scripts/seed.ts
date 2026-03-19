import "dotenv/config";
import bcrypt from "bcrypt";
import connectToDatabase from "@/config/db.config";
import { MongooseRepository } from "@/utils/crud.util";
import User, { IUser } from "@/modules/user/models/user.model";
import { DepartmentModel, IDepartment } from "@/modules/departments/department.model";
import { departmentTemplates } from "./seeding/templates";
import { generateSuperAdmin } from "./seeding/super-admin.seeder";
import { generateEmployees } from "./seeding/employee.seeder";
import { generateDepartment } from "./seeding/department.seeder";

const seedData = async () => {
  try {
    await connectToDatabase();

    const userRepo = new MongooseRepository<IUser>(User);
    const deptRepo = new MongooseRepository<IDepartment>(DepartmentModel);

    // Clear existing data
    await userRepo.deleteMany({});
    await deptRepo.deleteMany({});

    console.log("Cleared existing data");

    // Seed in dependency order
    const hashedPw = await bcrypt.hash("password123", 10);

    await generateSuperAdmin(userRepo);

    for (const template of departmentTemplates) {
      const users = await generateEmployees(5, userRepo, hashedPw);
      await generateDepartment(template, users, deptRepo);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedData();
