const express = require('express');
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, createMenuItem);

router.route('/:id')
  .put(protect, updateMenuItem)
  .delete(protect, deleteMenuItem);

module.exports = router;