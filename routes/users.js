// routes/users.js

const router = require('express').Router();
const bcrypt = require('bcryptjs'); // Import bcrypt
let User = require('../models/user.model');

// --- User Registration with Password Hashing ---
router.route('/register').post(async (req, res) => { // Make the function async
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json('Error: User with this email already exists.');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Save the hashed password
    });

    await newUser.save();
    res.json('User registered successfully!');

  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// --- User Login ---
router.route('/login').post(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json('Error: Invalid credentials.');
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json('Error: Invalid credentials.');
    }

    // For a real app, you would generate a JWT (JSON Web Token) here
    // For now, we'll send back a success message and user info (without password)
    res.json({
        message: 'Login successful!',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});


module.exports = router;