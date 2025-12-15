const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET api/asteroids
// @desc    Get asteroids passing Earth today (from NASA NeoWs API)
router.get('/', async (req, res) => {
  try {
    // 1. Get Today's Date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // 2. Call NASA API
    // We use the DEMO_KEY. In production, you'd use your real key.
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=DEMO_KEY`;
    
    const response = await axios.get(url);
    
    // 3. Clean up the data
    // NASA returns a huge mess. We just want the list of rocks.
    const asteroids = response.data.near_earth_objects[today];

    // Let's verify we actually got data
    if (!asteroids) {
      return res.status(404).json({ msg: "No asteroids found today (Earth is safe!)" });
    }

    // 4. Send only the first 3-5 asteroids to keep the UI clean
    // We map them to a simpler format for our frontend
    const simplifiedList = asteroids.slice(0, 4).map(rock => ({
      id: rock.id,
      name: rock.name,
      hazardous: rock.is_potentially_hazardous_asteroid,
      diameter: Math.round(rock.estimated_diameter.meters.estimated_diameter_max), // Size in meters
      speed: Math.round(rock.close_approach_data[0].relative_velocity.kilometers_per_hour), // Speed in km/h
      missDistance: Math.round(rock.close_approach_data[0].miss_distance.kilometers) // Distance from Earth
    }));

    res.json(simplifiedList);

  } catch (err) {
    console.error("NASA API Error:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;