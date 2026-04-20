const Order = require('../models/Order');
const Booking = require('../models/Booking');

// @desc    Get reports overview
// @route   GET /api/reports/overview
// @access  Private
const getReportsOverview = async (req, res) => {
  try {
    let query = {};

    // Filter by restaurant for restaurant admin/staff
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      query.restaurant = req.user.restaurant;
    }

    // Date range filter
    const { startDate, endDate } = req.query;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Order statistics
    const totalOrders = await Order.countDocuments(query);
    const completedOrders = await Order.countDocuments({ ...query, status: 'delivered' });
    const pendingOrders = await Order.countDocuments({ ...query, status: 'pending' });

    // Revenue statistics
    const orders = await Order.find(query);
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Booking statistics
    const totalBookings = await Booking.countDocuments(query);
    const confirmedBookings = await Booking.countDocuments({ ...query, status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ ...query, status: 'cancelled' });

    // Popular menu items (simplified)
    const menuItemStats = await Order.aggregate([
      { $match: query },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);

    // Busy hours analysis
    const busyHours = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $hour: '$time' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      orderStats: {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue,
        averageOrderValue,
      },
      bookingStats: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
      },
      popularItems: menuItemStats,
      busyHours,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReportsOverview,
};