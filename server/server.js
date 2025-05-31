import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config(); // Load environment variables from .env file

import { GoogleGenerativeAI } from '@google/generative-ai' // Import Gemini library


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows cross-origin requests from your React app
app.use(express.json()); // Parses incoming JSON requests

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API); // Use your Google API Key

// Choose the model: gemini-2.0-flash
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// AI Chatbot Route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // For gemini-2.0-flash, you can use generateContent directly for simple prompts
        // For multi-turn conversations, you'd typically use model.startChat()
        const result = await model.generateContent(message); // Send message to the model
        const aiReply = result.response.text(); // Get the text response

        res.json({ reply: aiReply });

    } catch (error) {
        console.error('Error calling Gemini API with gemini-2.0-flash:', error.message);
        if (error.response && error.response.data) {
            console.error('Gemini API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to get response from AI.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});