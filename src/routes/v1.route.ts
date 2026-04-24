import express from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import celebrityRoutes from "../modules/celebrity/celebrity.route";
import fanRoutes from "../modules/fan/fan.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/celebrities", celebrityRoutes);
router.use("/fans", fanRoutes);

export default router;
