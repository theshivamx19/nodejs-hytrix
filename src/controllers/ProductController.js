// Import necessary modules
import express from 'express';
import Product from './models/productModel'; // Import the Product model

const router = express.Router();

// Create product endpoint
router.post('/create', async (req, res) => {
    try {
        // Create a new product
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            size: req.body.size,
            // Additional fields as needed
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        res.status(201).json({ product: savedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Search/filter products endpoint
router.get('/search', async (req, res) => {
    try {
        const { name, size, price } = req.query;
        const filter = {};

        // Add conditions to the filter based on query parameters
        if (name) {
            filter.name = { $regex: new RegExp(name), $options: 'i' };
        }
        if (size) {
            filter.size = size;
        }
        if (price) {
            filter.price = { $lte: parseInt(price) }; // Assuming price is a number
        }

        // Find products based on the filter
        const products = await Product.find(filter);

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update product endpoint
router.put('/update/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        // Check if the provided productId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Find the product by ObjectId
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product fields based on the request body
        if (req.body.name) {
            product.name = req.body.name;
        }
        if (req.body.description) {
            product.description = req.body.description;
        }
        if (req.body.price) {
            product.price = req.body.price;
        }
        if (req.body.size) {
            product.size = req.body.size;
        }
        // Add additional fields as needed

        // Save the updated product to the database
        const updatedProduct = await product.save();

        res.status(200).json({ product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
