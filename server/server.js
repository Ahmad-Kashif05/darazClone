
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use("/api/admin", adminRoutes);
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);
app.get("/", (req, res) => {
  res.send("Daraz Clone API is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working!",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in server/.env");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "daraz_clone",
    });

    console.log("MongoDB connected: daraz_clone");
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed.",
    });
  }

  next();
});
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
};

startServer();
