// routes/users.js

const router = require('express').Router();
const bcrypt = require('bcryptjs'); // Import bcrypt
let User = require('../models/user.model');

// --- User Registration with Password Hashing ---
router.route('/register').post(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json('Error: User with this email already exists.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique avatar URL for the new user
    const avatar = `https://placehold.co/150x150/00ffff/0a0c10?text=${username.charAt(0).toUpperCase()}`;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar, // Save the generated avatar URL
    });

    await newUser.save();
    res.json('User registered successfully!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});


// --- UPDATE User Login ---
router.route('/login').post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json('Error: Invalid credentials.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json('Error: Invalid credentials.');
    }

    // Send back more user info on login
    res.json({
        message: 'Login successful!',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar, // <-- ADD THIS
            gc_balance: user.gc_balance // <-- ADD THIS
        }
    });
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});
router.route('/:username').get(async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password -email'); // Exclude sensitive info

        if (!user) {
            return res.status(404).json('Error: User not found.');
        }
        res.json(user);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});


module.exports = router;