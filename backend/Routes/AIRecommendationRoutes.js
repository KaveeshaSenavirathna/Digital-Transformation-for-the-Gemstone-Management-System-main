const express = require('express');
const {
  generateRecommendations,
  saveUserPreferences,
  getUserPreferences,
  getRecommendationStats
} = require('../Controllers/AIRecommendationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.post('/recommendations', generateRecommendations);

// Protected routes (authentication required)
router.post('/preferences', authMiddleware, saveUserPreferences);
router.get('/preferences', authMiddleware, getUserPreferences);
router.get('/stats', authMiddleware, getRecommendationStats);

module.exports = router;
