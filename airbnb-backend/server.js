import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookingRoutes from "./routes/bookings.js";
import guestbookRoutes from "./routes/guestbook.js";
import { env } from 'process';

config(); // Initialize dotenv

const app = express();

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());

// MongoDB connection with detailed error logging
mongoose
  .connect(env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/guestbook", guestbookRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
const PORT = env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});