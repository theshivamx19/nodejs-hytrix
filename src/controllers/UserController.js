// Import necessary modules
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/userModel'; // Import the User model

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            // Additional fields as needed
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        res.status(201).json({ user: savedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update user endpoint
router.put('/update/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if the provided userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find the user by ObjectId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields based on the request body
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        // Add additional fields as needed

        // Save the updated user to the database
        const updatedUser = await user.save();

        res.status(200).json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
