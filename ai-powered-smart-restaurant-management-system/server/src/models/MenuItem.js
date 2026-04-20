const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a menu item name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  ingredients: [{
    type: String,
    trim: true,
  }],
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  isVegan: {
    type: Boolean,
    default: false,
  },
  isGlutenFree: {
    type: Boolean,
    default: false,
  },
  calories: {
    type: Number,
    min: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number, // in minutes
    min: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MenuItem', menuItemSchema);