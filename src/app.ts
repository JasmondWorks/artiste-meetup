import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db.config";
import v1Routes from "./routes/v1.route";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { AppError } from "./utils/app-error.util";
import swaggerSpec from "./config/swagger.config";

const app = express();

connectToDatabase();

app.use(cors({
  origin: process.env.CLIENT_URL || true, // `true` reflects request origin — set CLIENT_URL in production
  credentials: true,                      // required for httpOnly cookie to be sent/received
}));
app.use(express.json());
app.use(cookieParser());                  // required for req.cookies (refresh token reads)

// Custom Swagger UI handler — bypasses swagger-ui-express entirely.
// @vercel/node (ncc) cannot serve the local swagger-ui-dist static files at
// runtime, so we load all UI assets from a pinned CDN and embed the spec JSON
// directly in the page. No filesystem access or extra network requests needed.
const SWAGGER_CDN = "https://unpkg.com/swagger-ui-dist@5.32.1";
app.get("/api-docs", (_, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Artiste Meetup API Docs</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="${SWAGGER_CDN}/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${SWAGGER_CDN}/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        SwaggerUIBundle({
          spec: ${JSON.stringify(swaggerSpec)},
          dom_id: "#swagger-ui",
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
          layout: "BaseLayout",
          persistAuthorization: true,
          withCredentials: true,
        });
      };
    </script>
  </body>
</html>`);
});

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
