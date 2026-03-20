import app from "../src/app";
import connectToDatabase from "../src/config/db.config";

let isDbConnected = false;

const initializeServices = async () => {
  if (!isDbConnected) {
    await connectToDatabase();
    isDbConnected = true;
  }
};

export default async (req: any, res: any) => {
  try {
    await initializeServices();

    // Vercel may pre-read the body as a Buffer/string before Express sees it.
    // Parse it back to a JSON object so express.json() middleware works correctly.
    if (req.body && typeof req.body !== "object") {
      try {
        req.body = JSON.parse(req.body.toString());
      } catch {
        // Not JSON — leave as-is
      }
    }

    return app(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
