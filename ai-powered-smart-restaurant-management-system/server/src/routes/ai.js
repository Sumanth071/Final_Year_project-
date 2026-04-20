const express = require('express');
const { getAIInsights, getRecommendations, chatbotResponse } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/insights', protect, getAIInsights);
router.post('/recommendations', protect, getRecommendations);
router.post('/chatbot', protect, chatbotResponse);

module.exports = router;