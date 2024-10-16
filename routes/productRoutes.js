const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController.js');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Admin)
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
