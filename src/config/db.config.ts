import mongoose from "mongoose";
import config from "./env.config";

const connectToDatabase = async () => {
  // Guard: if already connected, skip — prevents pool exhaustion across
  // serverless invocations where the module may be reused between requests.
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(config.db.url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // let the caller surface the error; never kill the process in a serverless env
  }
};

export default connectToDatabase;
