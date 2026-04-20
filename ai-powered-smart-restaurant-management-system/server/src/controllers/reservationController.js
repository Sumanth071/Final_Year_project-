const Reservation = require('../models/Reservation');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
const getReservations = async (req, res) => {
  try {
    let query = {};

    // Filter by restaurant
    if (req.query.restaurant) {
      query.restaurant = req.query.restaurant;
    }

    // Restaurant admin/staff can only see their restaurant's reservations
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      query.restaurant = req.user.restaurant;
    }

    // Users can see their own reservations
    if (req.user.role === 'guest') {
      query.user = req.user._id;
    }

    const reservations = await Reservation.find(query)
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .populate('tables', 'number capacity')
      .sort({ date: 1, time: 1 });

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .populate('tables', 'number capacity');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check permissions
    if (req.user.role === 'guest' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (reservation.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    req.body.user = req.user._id;

    const reservation = await Reservation.create(req.body);

    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check permissions
    if (req.user.role === 'guest' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (reservation.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check permissions
    if (req.user.role === 'guest' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (reservation.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.json({ message: 'Reservation removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
};