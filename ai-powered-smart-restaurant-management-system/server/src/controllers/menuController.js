const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu-items
// @access  Public/Private
const getMenuItems = async (req, res) => {
  try {
    let query = { available: true };

    // Filter by restaurant if provided
    if (req.query.restaurant) {
      query.restaurant = req.query.restaurant;
    }

    // Restaurant admin/staff can see all items including unavailable
    if (req.user && ['restaurantadmin', 'staff'].includes(req.user.role)) {
      if (req.user.restaurant) {
        query.restaurant = req.user.restaurant;
        delete query.available; // Show all items for restaurant staff
      }
    }

    const menuItems = await MenuItem.find(query).populate('restaurant', 'name');

    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu-items/:id
// @access  Public/Private
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('restaurant', 'name');

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create menu item
// @route   POST /api/menu-items
// @access  Private (Restaurant Admin, Staff)
const createMenuItem = async (req, res) => {
  try {
    // Set restaurant based on user role
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      req.body.restaurant = req.user.restaurant;
    }

    const menuItem = await MenuItem.create(req.body);

    res.status(201).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu-items/:id
// @access  Private (Restaurant Admin, Staff)
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check permissions
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (menuItem.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu-items/:id
// @access  Private (Restaurant Admin, Staff)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check permissions
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (menuItem.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Menu item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};