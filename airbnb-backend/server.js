import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookingRoutes from "./routes/bookings.js";
import guestbookRoutes from "./routes/guestbook.js";

config(); // Initialize dotenv

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());

// MongoDB connection with detailed error logging
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error details:", {
      message: err.message,
      code: err.code,
      errorLabels: err.errorLabels,
      name: err.name
    });
  });

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/guestbook", guestbookRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));