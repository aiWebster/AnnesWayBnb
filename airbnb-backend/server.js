import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookingRoutes from "./routes/bookings.js";
import guestbookRoutes from "./routes/guestbook.js";

config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://annesway.onrender.com',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
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
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});