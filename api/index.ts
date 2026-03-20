/**
 * Vercel serverless entry point.
 *
 * @vercel/node bundles this file with ncc, which resolves tsconfig.json `paths`
 * at bundle time — so every `@/` alias in src/ is rewritten to a real path
 * before the function is deployed. No runtime alias resolver is required.
 *
 * Importing `../src/app` also triggers:
 *   - dotenv/config   → environment variables are loaded
 *   - connectToDatabase() → Mongoose connection is established
 *     (Mongoose caches the connection across warm invocations)
 *
 * The exported `app` is a standard Node.js `http.IncomingMessage` handler,
 * which is exactly what Vercel's serverless runtime expects.
 */
import app from "../src/app";

export default app;
