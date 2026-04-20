const Booking = require('../models/Booking');
const Table = require('../models/Table');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    let query = {};

    // Filter by restaurant
    if (req.query.restaurant) {
      query.restaurant = req.query.restaurant;
    }

    // Restaurant admin/staff can only see their restaurant's bookings
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      query.restaurant = req.user.restaurant;
    }

    // Users can see their own bookings
    if (req.user.role === 'guest') {
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('table', 'number capacity')
      .populate('restaurant', 'name')
      .sort({ date: 1, time: 1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('table', 'number capacity')
      .populate('restaurant', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    if (req.user.role === 'guest' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (booking.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { table, restaurant, date, time, numberOfGuests } = req.body;

    // Check if table exists and belongs to restaurant
    const tableDoc = await Table.findById(table);
    if (!tableDoc || tableDoc.restaurant.toString() !== restaurant) {
      return res.status(400).json({ message: 'Invalid table or restaurant' });
    }

    // Check if table capacity is sufficient
    if (tableDoc.capacity < numberOfGuests) {
      return res.status(400).json({ message: 'Table capacity is insufficient' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      table,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Table is already booked for this time' });
    }

    req.body.user = req.user._id;

    const booking = await Booking.create(req.body);

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    if (req.user.role === 'guest' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (booking.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    if (req.user.role === 'guest' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (booking.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};