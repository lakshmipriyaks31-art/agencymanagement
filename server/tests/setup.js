import mongoose from "mongoose";
import { connectDB } from "../../../src/config/db.js";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

console.log("setup file is executed")