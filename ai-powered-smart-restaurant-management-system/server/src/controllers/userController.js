const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Super Admin, Restaurant Admin)
const getUsers = async (req, res) => {
  try {
    let query = {};

    // Restaurant admin can only see users from their restaurant
    if (req.user.role === 'restaurantadmin') {
      query.restaurant = req.user.restaurant;
    }

    const users = await User.find(query).select('-password').populate('restaurant', 'name');

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('restaurant', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (req.user.role === 'restaurantadmin' && user.restaurant.toString() !== req.user.restaurant.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Super Admin, Restaurant Admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, restaurant, phone } = req.body;

    // Restaurant admin can only create users for their restaurant
    if (req.user.role === 'restaurantadmin') {
      if (restaurant && restaurant !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized to create users for other restaurants' });
      }
      req.body.restaurant = req.user.restaurant;
    }

    const user = await User.create(req.body);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      restaurant: user.restaurant,
      phone: user.phone,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'User with this email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (req.user.role === 'restaurantadmin' && user.restaurant.toString() !== req.user.restaurant.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Users can update their own profile, admins can update others
    if (req.user._id.toString() !== req.params.id && !['superadmin', 'restaurantadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Super Admin, Restaurant Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (req.user.role === 'restaurantadmin' && user.restaurant.toString() !== req.user.restaurant.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};