const express = require('express');
const { getTables, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getTables)
  .post(protect, createTable);

router.route('/:id')
  .put(protect, updateTable)
  .delete(protect, deleteTable);

module.exports = router;