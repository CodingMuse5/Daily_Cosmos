require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Post = require('./models/post'); 
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const app = express();
const userRoutes = require('./routes/users');
const asteroidRoutes = require('./routes/asteroids');


// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// --- THE MAIN ROUTE ---
app.get('/api/daily', async (req, res) => {
  try {
    // 1. Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // 2. Check Database first (Cache)
    let post = await Post.findOne({ date: today });

    if (post) {
      console.log("Serving from Database (Cache Hit)");
      return res.json(post);
    }

    // 3. If not in DB, fetch from NASA
    console.log("Fetching from NASA API...");
    const apiKey = process.env.NASA_API_KEY;
    const nasaUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    const response = await axios.get(nasaUrl, { timeout: 15000 });
    const data = response.data;

    // 4. Save to MongoDB
    const newPost = new Post({
      date: data.date,
      title: data.title,
      explanation: data.explanation,
      imageUrl: data.url,
      mediaType: data.media_type
    });

    await newPost.save();
    console.log("Saved to MongoDB");

    // 5. Send to User
    res.json(newPost);

  } catch (err) {
    console.error("NASA Failed, sending backup:", err.message);
    
    // You MUST send this JSON back so the site doesn't load forever
    res.json({
        title: "Backup Space Data",
        url: "https://apod.nasa.gov/apod/image/2301/DiabloCanyon_Benintende_960.jpg",
        explanation: "NASA API is currently unavailable. This is a backup image showing the Milky Way...",
        media_type: "image"
    });
  }
});

const PORT = process.env.PORT || 5000;
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/asteroids', asteroidRoutes);
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));