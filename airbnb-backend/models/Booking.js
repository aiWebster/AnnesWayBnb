import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  datesInRange: [Date], // Array of dates between start and end
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;