const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API with your secret key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST route: /api/copilot/ask
router.post('/ask', async (req, res) => {
  try {
    const { message } = req.body;

    // Use the Gemini 1.5 Flash model (it's the fastest for chat)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // We give the AI a "System Prompt" so it acts like a space co-pilot
    const systemPrompt = "You are the Cosmic Co-Pilot, an AI assistant on a spaceship dashboard. Keep your answers concise, space-themed, and helpful. The user is asking: ";
    
    const finalPrompt = systemPrompt + message;

    // Call the AI
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    // Send the AI's answer back to your React frontend
    res.json({ reply: text });

  } catch (error) {
    console.error("Co-Pilot Error:", error);
    res.status(500).json({ msg: "Communication link with Co-Pilot failed." });
  }
});

module.exports = router;