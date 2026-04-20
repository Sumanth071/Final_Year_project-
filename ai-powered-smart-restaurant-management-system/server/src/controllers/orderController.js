const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let query = {};

    // Filter by restaurant
    if (req.query.restaurant) {
      query.restaurant = req.query.restaurant;
    }

    // Restaurant admin/staff can only see their restaurant's orders
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      query.restaurant = req.user.restaurant;
    }

    // Users can see their own orders
    if (req.user.role === 'guest') {
      query.user = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .populate('table', 'number')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .populate('table', 'number')
      .populate('items.menuItem', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions
    if (req.user.role === 'guest' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (order.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, restaurant, table, orderType } = req.body;

    let totalAmount = 0;

    // Calculate total and validate items
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem || !menuItem.available) {
        return res.status(400).json({ message: `Menu item ${item.menuItem} is not available` });
      }
      if (menuItem.restaurant.toString() !== restaurant) {
        return res.status(400).json({ message: 'Menu item does not belong to the selected restaurant' });
      }
      item.price = menuItem.price;
      totalAmount += menuItem.price * item.quantity;
    }

    req.body.user = req.user._id;
    req.body.totalAmount = totalAmount;

    const order = await Order.create(req.body);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions
    if (req.user.role === 'guest' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (order.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions
    if (req.user.role === 'guest' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      if (order.restaurant.toString() !== req.user.restaurant.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: 'Order removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};