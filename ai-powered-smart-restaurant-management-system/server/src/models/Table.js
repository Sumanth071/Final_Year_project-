const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'Please add a table number'],
    min: 1,
  },
  capacity: {
    type: Number,
    required: [true, 'Please add table capacity'],
    min: 1,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available',
  },
  location: {
    type: String,
    enum: ['indoor', 'outdoor', 'private', 'bar'],
    default: 'indoor',
  },
  smokingAllowed: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Ensure unique table number per restaurant
tableSchema.index({ number: 1, restaurant: 1 }, { unique: true });

module.exports = mongoose.model('Table', tableSchema);