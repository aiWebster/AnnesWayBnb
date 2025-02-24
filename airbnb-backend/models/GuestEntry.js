import mongoose from 'mongoose';

const guestEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
});

export default mongoose.model('GuestEntry', guestEntrySchema); 