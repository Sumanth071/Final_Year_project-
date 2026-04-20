const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private
const getTables = async (req, res) => {
  try {
    let query = { isActive: true };

    // Filter by restaurant
    if (req.query.restaurant) {
      query.restaurant = req.query.restaurant;
    }

    // Restaurant admin/staff can only see their restaurant's tables
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      query.restaurant = req.user.restaurant;
    }

    const tables = await Table.find(query).populate('restaurant', 'name');

    res.json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single table
// @route   GET /api/tables/:id
// @access  Private
const getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate('restaurant', 'name');

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check permissions
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (table.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json(table);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create table
// @route   POST /api/tables
// @access  Private (Restaurant Admin, Staff)
const createTable = async (req, res) => {
  try {
    // Set restaurant based on user role
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      req.body.restaurant = req.user.restaurant;
    }

    const table = await Table.create(req.body);

    res.status(201).json(table);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Table number already exists for this restaurant' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private (Restaurant Admin, Staff)
const updateTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check permissions
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (table.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const updatedTable = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private (Restaurant Admin, Staff)
const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check permissions
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (table.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    await Table.findByIdAndDelete(req.params.id);

    res.json({ message: 'Table removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
};