const Product = require('../models/Product.js');

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, lowStockThreshold } = req.body;

  try {
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      lowStockThreshold,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product not found with id of ${req.params.id}` });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ message: `Product not found with id of ${req.params.id}` });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product not found with id of ${req.params.id}` });
    }

    // Update fields
    const { name, description, price, stock, lowStockThreshold } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.stock = stock !== undefined ? stock : product.stock;
    product.lowStockThreshold =
      lowStockThreshold !== undefined
        ? lowStockThreshold
        : product.lowStockThreshold;

    // Validate stock levels
    if (product.stock < 0) {
      return res
        .status(400)
        .json({ message: 'Stock level cannot be negative' });
    }

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ message: `Product not found with id of ${req.params.id}` });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product not found with id of ${req.params.id}` });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Product removed',
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ message: `Product not found with id of ${req.params.id}` });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};
