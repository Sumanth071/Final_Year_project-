const Order = require('../models/Order');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    let query = {};

    // Filter by restaurant for restaurant admin/staff
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      query.restaurant = req.user.restaurant;
    }

    // Get counts
    const totalOrders = await Order.countDocuments(query);
    const totalBookings = await Booking.countDocuments(query);
    const totalUsers = req.user.role === 'superadmin' ? await User.countDocuments() : 0;
    const totalRestaurants = req.user.role === 'superadmin' ? await Restaurant.countDocuments({ isActive: true }) : 0;

    // Get recent orders
    const recentOrders = await Order.find(query)
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent bookings
    const recentBookings = await Booking.find(query)
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysOrders = await Order.countDocuments({
      ...query,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const todaysBookings = await Booking.countDocuments({
      ...query,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Revenue calculation
    const orders = await Order.find(query);
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      summary: {
        totalOrders,
        totalBookings,
        totalUsers,
        totalRestaurants,
        todaysOrders,
        todaysBookings,
        totalRevenue,
      },
      recentOrders,
      recentBookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardSummary,
};