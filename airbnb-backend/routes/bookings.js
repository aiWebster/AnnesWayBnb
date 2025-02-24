import express from 'express';
import Booking from '../models/Booking.js'; // Adjust the path if needed

const router = express.Router();

// POST route to handle booking creation
router.post('/', async (req, res) => {
  try {
    const { name, email, startDate, endDate } = req.body;

    // Validate required fields
    if (!name || !email || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert dates to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      $or: [
        // New booking starts during an existing booking
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        },
        // New booking ends during an existing booking
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(409).json({
        message: 'Dates overlap with existing booking',
        overlapping: true,
        existingBookings: overlappingBookings
      });
    }

    const newBooking = new Booking({
      name,
      email,
      startDate,
      endDate
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// GET route to fetch all bookings (for checking booked dates)
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find({});
    console.log('Found bookings:', bookings);

    // Generate an array of all booked dates with names
    const bookedDates = bookings.flatMap((booking) => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      const dates = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dates.push({
          date: currentDate.toISOString().split('T')[0],
          name: booking.name,
          email: booking.email
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    });

    console.log('Sending booked dates:', bookedDates);
    res.status(200).json(bookedDates);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    console.log('Sending bookings:', bookings); // Debug log
    res.json(bookings);
  } catch (error) {
    console.error('Error in GET /bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;