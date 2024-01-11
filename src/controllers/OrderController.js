// Import necessary modules
import express from 'express';
import Order from './models/orderModel'; // Import the Order model
import Product from './models/productModel'; // Import the Product model
import mongoose from 'mongoose';

const router = express.Router();

// Create order endpoint
router.post('/create', async (req, res) => {
  try {
    // Check if products array is provided and not empty
    if (!req.body.products || req.body.products.length === 0) {
      return res.status(400).json({ message: 'Products array is required and cannot be empty.' });
    }

    // Validate productIds and retrieve product details
    const products = await Promise.all(
      req.body.products.map(async (product) => {
        if (!mongoose.Types.ObjectId.isValid(product.productId)) {
          throw new Error(`Invalid product ID: ${product.productId}`);
        }

        const productDetails = await Product.findById(product.productId);
        if (!productDetails) {
          throw new Error(`Product not found for ID: ${product.productId}`);
        }

        return {
          product: productDetails._id,
          quantity: product.quantity || 1, // Default quantity to 1 if not provided
        };
      })
    );

    // Calculate total amount based on product prices and quantities
    const totalAmount = products.reduce((total, product) => {
      return total + product.product.price * product.quantity;
    }, 0);

    // Create a new order
    const newOrder = new Order({
      user: req.body.userId, // Assuming userId is provided in the request body
      items: products,
      totalAmount,
      // Additional fields as needed
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({ order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get all orders endpoint
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').populate('user');

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get order by ID endpoint
router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Check if the provided orderId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Find the order by ObjectId
    const order = await Order.findById(orderId).populate('items.product').populate('user');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update order status endpoint
router.put('/update-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Check if the provided orderId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Find the order by ObjectId
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order status
    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({ order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Delete order endpoint
router.delete('/delete/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Check if the provided orderId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Find the order by ObjectId and remove it
    const deletedOrder = await Order.findByIdAndRemove(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
