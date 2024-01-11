// Import necessary modules
import express from 'express';
import Cart from './models/cartModel'; // Import the Cart model
import Product from './models/productModel'; // Import the Product model
import mongoose from 'mongoose';

const router = express.Router();

// Add item to cart endpoint
router.post('/add-item', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate userId and productId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid user ID or product ID' });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product is already in the cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    // Save the updated cart to the database
    const updatedCart = await cart.save();

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get cart endpoint
router.get('/get/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update cart item endpoint
router.put('/update-item/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    // Validate userId and productId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid user ID or product ID' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the cart item by productId
    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    // Update the quantity
    cartItem.quantity = quantity || 1;

    // Save the updated cart to the database
    const updatedCart = await cart.save();

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Clear cart endpoint
router.delete('/clear/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the user's cart and remove it
    const deletedCart = await Cart.findOneAndRemove({ user: userId });
    if (!deletedCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
