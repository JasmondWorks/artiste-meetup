import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db.config";
import v1Routes from "./routes/v1.route";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { AppError } from "./utils/app-error.util";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";

const app = express();

connectToDatabase();

app.use(cors({
  origin: process.env.CLIENT_URL || true, // `true` reflects request origin — set CLIENT_URL in production
  credentials: true,                      // required for httpOnly cookie to be sent/received
}));
app.use(express.json());
app.use(cookieParser());                  // required for req.cookies (refresh token reads)

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true, // keeps Bearer token across page refreshes
      withCredentials: true,      // sends httpOnly cookies (refresh token) from Swagger UI
    },
  }),
);

app.use("/api/v1", v1Routes);

app.get("/", (_, res) => {
  res.status(200).json({ ok: true, message: "Welcome to the Artiste Meetup API", docs: "/api-docs" });
});

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
app.get("/health", (_, res) => {
  res.status(200).json({ ok: true });
});

// 404 catch-all
app.use((req: Request, _: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler (must be last middleware)
app.use(globalErrorHandler);

export default app;
