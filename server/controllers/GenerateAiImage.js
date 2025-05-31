// import * as dotenv from 'dotenv';
// import OpenAI from 'openai';

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const generateImage = async (req, res) => {
//   console.log('Request body:', req.body);
//   const { prompt } = req.body;
//   console.log(prompt);
//   const testPrompt = "a simple red flower";

//   try {
//     const response = await openai.images.generate({
//       prompt: testPrompt,
//       n: 1,
//       size: '1024x1024',
//       response_format: 'b64_json',
//     });

//     const generatedImage = response.data[0].b64_json;
//     return res.status(200).json({ photo: generatedImage });

//   } catch (error) {
//     console.error('Error generating image:', error);
//     return res.status(500).json({ error: 'Failed to generate image' });
//   }
// };

// export default generateImage






import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Or "gemini-pro-vision" if you want to input images

const generateTextWithGemini = async (req, res) => {
    console.log('Request body:', req.body);
    const { prompt } = req.body; // Assuming you send a 'textPrompt'

    if (!prompt) {
        return res.status(400).json({ error: 'Text prompt is required.' });
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();

        return res.status(200).json({ generatedText });

    } catch (error) {
        console.error('Error generating text with Gemini:', error);
        // More robust error handling for Gemini API errors
        return res.status(500).json({ error: 'Failed to generate text with Gemini' });
    }
};

export default generateTextWithGemini;