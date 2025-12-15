const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// 1. REGISTER USER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save User
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Create Token (ID Card)
    const payload = { user: { id: user.id } };
    jwt.sign(payload, "secret_token_key", { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token }); // Send token to frontend
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 2. LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // Create Token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, "secret_token_key", { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/me
// @desc    Get current user's profile & rank data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Find user and populate 'favorites' so we can count them
    const user = await User.findById(req.user.id).select('-password');
    // Note: If you store likes in the Post model (not User), we count differently.
    // Based on yesterday's code, we stored likes inside POSTS.
    // So we need to count how many posts have this user's ID in their 'likes' array.
    
    const Post = require('../models/post'); // Import Post model locally
    const likeCount = await Post.countDocuments({ likes: req.user.id });

    // Send back user info + like count
    res.json({ ...user._doc, likeCount });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;