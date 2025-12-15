const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/post');

// @route   PUT api/posts/like/:date
// @desc    Like or Unlike a post
// @access  Private (Logged in users only)
router.put('/like/:date', auth, async (req, res) => {
  try {
    // 1. Find the post by Date
    const post = await Post.findOne({ date: req.params.date });
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // 2. Check if post has already been liked by this user
    if (post.likes.filter(like => like.toString() === req.user.id).length > 0) {
      // If yes, remove the like (Unlike)
      const removeIndex = post.likes.map(like => like.toString()).indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
    } else {
      // If no, add the like
      post.likes.unshift(req.user.id);
    }

    // 3. Save and return
    await post.save();
    res.json(post.likes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/favorites', auth, async (req, res) => {
  try {
    // Find posts where the 'likes' array contains the User's ID
    const posts = await Post.find({ likes: req.user.id }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;