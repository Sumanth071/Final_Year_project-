const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  eventName: {
    type: String,
    trim: true,
  },
  eventType: {
    type: String,
    enum: ['birthday', 'anniversary', 'corporate', 'wedding', 'other'],
    default: 'other',
  },
  date: {
    type: Date,
    required: [true, 'Please add a reservation date'],
  },
  time: {
    type: String,
    required: [true, 'Please add a reservation time'],
  },
  duration: {
    type: Number, // in hours
    default: 3,
    min: 1,
    max: 12,
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Please add number of guests'],
    min: 1,
  },
  tables: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
  }],
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
  budget: {
    type: Number,
    min: 0,
  },
  menuPreferences: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);