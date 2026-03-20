import "dotenv/config";
import bcrypt from "bcrypt";
import connectToDatabase from "@/config/db.config";
import { MongooseRepository } from "@/utils/crud.util";
import User, { IUser } from "@/modules/user/user.model";
import { generateSuperAdmin } from "./seeding/super-admin.seeder";
import { generateEmployees } from "./seeding/employee.seeder";

// TODO: add department seeding once the departments module is implemented

const seedData = async () => {
  try {
    await connectToDatabase();

    const userRepo = new MongooseRepository<IUser>(User);

    // Clear existing data
    await userRepo.deleteMany({});

    console.log("Cleared existing data");

    // Seed in dependency order
    const hashedPw = await bcrypt.hash("password123", 10);

    await generateSuperAdmin(userRepo);
    await generateEmployees(5, userRepo, hashedPw);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedData();
