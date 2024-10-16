const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController.js');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, authorize('customer'), createOrder);
router.get('/myorders', protect, authorize('customer'), getOrders);

// Admin routes
router.get('/', protect, authorize('admin'), getOrders);
router.get('/:id', protect, authorize('admin'), getOrderById);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
