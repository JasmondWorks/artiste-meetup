import express from "express";
import authRoutes from "@/modules/auth/auth.route";
import userRoutes from "@/modules/user/user.route";
import departmentRoutes from "@/modules/departments/departments.route";

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get("/health", (_, res) => {
  res.status(200).json({ ok: true });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/departments", departmentRoutes);

// router.use("/products", productRoutes);  <- add new modules here

export default router;
