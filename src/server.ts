import app from "./app";
import connectToDatabase from "./config/db.config";

const PORT = process.env.PORT || 5000;

// Guard: only start the HTTP server when this file is the process entry point.
// On Vercel, api/index.ts is the entry and manages both DB init and the handler
// lifecycle — app.listen() must never be called in that context.
if (require.main === module) {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to database. Server not started.", err);
      process.exit(1);
    });
}

// Export the configured Express app so any importer (Vercel, tests, etc.) can use it.
export default app;
