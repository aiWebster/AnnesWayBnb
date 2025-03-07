import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { env } from 'process';
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
  next(err);
});

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

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log('Request to unknown route:', req.originalUrl);
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});