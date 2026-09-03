import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MongoURL = process.env.MONGO_URL;

if (!MongoURL) {
  throw new Error("MONGO_URL environment variables is not defined.");
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("MongoDB compass is connected (reused)");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };
    cached.promise = mongoose
      .connect(MongoURL, opts)
      .then((mongoose) => {
        console.log("MongoDB compass is connected (new)");
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("DB connection is error", error);
        throw error;
      });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    throw error;
  }
};

export default connectDB;
