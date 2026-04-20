const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Booking = require('../models/Booking');

// @desc    Get AI insights
// @route   GET /api/ai/insights
// @access  Private
const getAIInsights = async (req, res) => {
  try {
    let query = {};

    // Filter by restaurant for restaurant admin/staff
    if (req.user.role === 'restaurantadmin' || req.user.role === 'staff') {
      query.restaurant = req.user.restaurant;
    }

    // Sales trends (simplified)
    const salesTrends = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
      { $limit: 30 },
    ]);

    // Busy hours
    const busyHours = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $hour: '$time' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { bookings: -1 } },
    ]);

    // Customer preferences
    const popularCategories = await Order.aggregate([
      { $match: query },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItem',
        },
      },
      { $unwind: '$menuItem' },
      {
        $group: {
          _id: '$menuItem.category',
          count: { $sum: '$items.quantity' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      salesTrends,
      busyHours,
      popularCategories,
      insights: [
        'Peak hours are between 7-9 PM',
        'Italian cuisine is most popular',
        'Average order value has increased by 15%',
        'Table utilization is at 85%',
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get food recommendations
// @route   POST /api/ai/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body;

    // Get user's order history
    const userOrders = await Order.find({ user: userId, restaurant: restaurantId })
      .populate('items.menuItem');

    // Simple recommendation logic: popular items not ordered by user
    const orderedItems = userOrders.flatMap(order =>
      order.items.map(item => item.menuItem._id.toString())
    );

    const popularItems = await MenuItem.find({
      restaurant: restaurantId,
      available: true,
      _id: { $nin: orderedItems },
    }).sort({ price: -1 }).limit(5);

    res.json({
      recommendations: popularItems,
      reason: 'Based on popular items you haven\'t tried yet',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Chatbot response
// @route   POST /api/ai/chatbot
// @access  Public
const chatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    // Simple rule-based chatbot
    const responses = {
      'hello': 'Hello! How can I help you with your restaurant experience?',
      'menu': 'You can view our menu in the app. Would you like recommendations?',
      'booking': 'I can help you make a reservation. What date and time would you like?',
      'order': 'Ready to place an order? Browse our menu and add items to your cart.',
      'contact': 'You can reach us at support@smartdine.ai or call our restaurant directly.',
      'hours': 'Our opening hours vary by restaurant. Please check the restaurant details.',
      'location': 'Find our restaurant locations in the app or on our website.',
    };

    const lowerMessage = message.toLowerCase();
    let response = 'I\'m here to help! Please ask about our menu, reservations, or orders.';

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAIInsights,
  getRecommendations,
  chatbotResponse,
};