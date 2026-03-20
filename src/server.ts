import app from "./app";

const PORT = process.env.PORT || 5000;

// Guard: only start the HTTP server when this file is the process entry point.
// When imported as a module (e.g. by the Vercel serverless handler in api/index.ts),
// app.listen() must NOT be called — Vercel manages the HTTP lifecycle itself.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the configured Express app so any importer (Vercel, tests, etc.) can use it.
export default app;
