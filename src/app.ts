import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import connectToDatabase from "./config/db.config";
import v1Routes from "./routes/v1.route";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { AppError } from "./utils/app-error.util";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";

const app = express();

connectToDatabase();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", v1Routes);

// 404 catch-all
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler (must be last middleware)
app.use(globalErrorHandler);

export default app;
