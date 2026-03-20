import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import v1Routes from "./routes/v1.route";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { AppError } from "./utils/app-error.util";
import swaggerSpec from "./config/swagger.config";

const app = express();

// ---------------------------------------------------------------------------
// CORS — must be applied before any routes so preflight OPTIONS requests are
// handled correctly. Vercel can silently drop OPTIONS before Express sees them
// unless we register app.options("*", cors()) explicitly.
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL,          // production frontend (set in Vercel dashboard)
  "http://localhost:3000",
  "http://localhost:5173",          // Vite default
  "http://localhost:8000",          // local Swagger / API port
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests (no Origin header) and listed origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,               // required for httpOnly refresh-token cookie
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // explicit preflight handler

app.use(express.json());
app.use(cookieParser());             // required for req.cookies (refresh token reads)

// ---------------------------------------------------------------------------
// Swagger UI — custom CDN handler, bypasses swagger-ui-express entirely.
// @vercel/node cannot serve local swagger-ui-dist static files; all UI assets
// are loaded from a pinned CDN and the spec JSON is embedded directly in the page.
// ---------------------------------------------------------------------------
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
