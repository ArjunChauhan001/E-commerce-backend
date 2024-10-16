const Order = require('../models/order');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Customer
exports.createOrder = async (req, res) => {
  const { orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items provided' });
  }

  try {
    let totalPrice = 0;

    // Validate product availability and calculate total price
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found with id ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}`,
        });
      }

      totalPrice += product.price * item.quantity;
    }

    // Deduct stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();

      // Check for low stock
      if (product.stock < product.lowStockThreshold) {
        // Implement alert mechanism (e.g., send email, log, etc.)
        console.warn(
          `Low stock alert for product ${product.name}: ${product.stock} left`
        );
        // TODO: Implement actual alerting (e.g., email notification)
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders (Admin) or user's orders (Customer)
// @route   GET /api/orders or /api/orders/myorders
// @access  Admin / Customer
exports.getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'admin') {
      orders = await Order.find()
        .populate('user', 'name email')
        .populate('orderItems.product', 'name price');
    } else {
      orders = await Order.find({ user: req.user._id }).populate(
        'orderItems.product',
        'name price'
      );
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single order by ID (Admin)
// @route   GET /api/orders/:id
// @access  Admin
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price');

    if (!order) {
      return res
        .status(404)
        .json({ message: `Order not found with id of ${req.params.id}` });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ message: `Order not found with id of ${req.params.id}` });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  // Validate status
  const validStatuses = ['Pending', 'Shipped', 'Delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ message: `Order not found with id of ${req.params.id}` });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ message: `Order not found with id of ${req.params.id}` });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};
