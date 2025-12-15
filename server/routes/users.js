const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/post');

// @route   GET api/users/buddies
// @desc    Find users with similar interests (The ML Part)
// @access  Private
router.get('/buddies', auth, async (req, res) => {
  try {
    // 1. Get the current user's liked posts
    // We populate 'favorites' to see the actual Post IDs (if you stored them in User model)
    // BUT since we stored likes in the POST model, we do a reverse search.
    
    // Find all posts that THIS user has liked
    const myLikedPosts = await Post.find({ likes: req.user.id });
    
    if (myLikedPosts.length === 0) {
      return res.json([]); // No likes yet? No buddies for you.
    }

    // Extract the IDs of these posts
    const postIds = myLikedPosts.map(post => post._id);

    // 2. Find OTHER users who liked these SAME posts
    // "Find users where their ID is present in the 'likes' array of these posts"
    // Note: This logic depends on how we want to query. 
    // A simpler approach for MongoDB:
    
    // Let's get ALL posts again, but this time look at the 'likes' array
    const matchedUsers = {};

    myLikedPosts.forEach(post => {
      post.likes.forEach(userId => {
        // Don't count yourself!
        if (userId.toString() !== req.user.id) {
          if (matchedUsers[userId]) {
            matchedUsers[userId]++; // Overlap score increases
          } else {
            matchedUsers[userId] = 1;
          }
        }
      });
    });

    // 3. Convert score object to an array: [{ userId, score }]
    const buddyIds = Object.keys(matchedUsers);
    
    // 4. Get the actual User Names from the DB
    const buddies = await User.find({ _id: { $in: buddyIds } }).select('-password');

    // Attach the "Match Score" to each buddy
    const buddiesWithScore = buddies.map(buddy => ({
      _id: buddy._id,
      username: buddy.username,
      email: buddy.email,
      matchScore: matchedUsers[buddy._id] // How many posts you both liked
    }));

    // Sort by highest match score
    buddiesWithScore.sort((a, b) => b.matchScore - a.matchScore);

    res.json(buddiesWithScore);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/add/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friendId = req.params.id;

    // Check if already friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ msg: "Already friends" });
    }

    // Add friend to array
    user.friends.push(friendId);
    await user.save();

    res.json(user.friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;