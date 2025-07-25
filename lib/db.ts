import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectDB() {
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(MONGODB_URI, {
    dbName: "portfolio",
  });
}
