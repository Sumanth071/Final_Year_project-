const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add a booking date'],
  },
  time: {
    type: String,
    required: [true, 'Please add a booking time'],
  },
  duration: {
    type: Number, // in hours
    default: 2,
    min: 1,
    max: 8,
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Please add number of guests'],
    min: 1,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  contactInfo: {
    name: String,
    phone: String,
    email: String,
  },
}, {
  timestamps: true,
});

// Ensure no double booking for same table at same time
bookingSchema.index({ table: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);