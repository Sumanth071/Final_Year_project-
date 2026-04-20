const express = require('express');
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getRestaurants)
  .post(protect, authorize('superadmin', 'restaurantadmin'), createRestaurant);

router
  .route('/:id')
  .get(protect, getRestaurant)
  .put(protect, authorize('superadmin', 'restaurantadmin'), updateRestaurant)
  .delete(protect, authorize('superadmin'), deleteRestaurant);

module.exports = router;