// import cors from 'cors';
// import express from "express"
// import mongoose from "mongoose"
// import * as dotenv from 'dotenv'
// import postRouter from "./routes/Post.js"
// import Generateimage  from './routes/Generateimage.js';

// dotenv.config();

// const app = express()
// app.use(cors())
// app.use(express.json({ limit: "50mb"}))
// app.use(express.urlencoded({ extended: true}))

// app.use((err, req, res, next) =>{
//     const status = err.status || 500;
//     const message = err.message || "Something went wrong";
//     return res.status(status).json({
//         success: false,
//         status,
//         message
//     })
// });

// app.use("/api/post", postRouter)
// app.use("/api/generateimage", Generateimage)

// app.get("/", async (req, res)=>{
//     res.status(200).json({
//         message: "Hello dev!"
//     })
// })

// const connectDB = ()=>{
//     mongoose.set("strictQuery", true);
//     mongoose.connect(process.env.DB_URL)
//     .then(()=> console.log("DB Connected"))
//     .catch((err)=> {
//         console.error(" failed connect to DB")
//         console.error(err);     
//     }
//     )
// }

// const startServer = async ()=>{
//     try{
//         connectDB();
//         app.listen(8080, ()=>{
//             console.log("server started");          
//         })
//     } catch(error){
//         console.log(error);
        
//     }
// }

// startServer()











import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import axios from 'axios';
import cors from 'cors';
dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Schema
const imageSchema = new mongoose.Schema({
  prompt: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

// Remove any existing indexes that may cause conflicts (optional, see instructions)
imageSchema.indexes().forEach((index) => {
  if (index.key.letter) {
    mongoose.model('Image').collection.dropIndex(index.key, (err) => {
      if (err) console.error('Error dropping index:', err);
      else console.log('Dropped index:', index);
    });
  }
});

const Image = mongoose.model('Image', imageSchema);

// Connect to MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API endpoint to generate image using Cloudflare Workers AI
app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // Handle binary image data
      }
    );

    // Log response for debugging
    console.log('Cloudflare API Response Headers:', response.headers);
    console.log('Cloudflare API Response Data (length):', response.data.length);

    // Convert binary response to base64
    const imageBase64 = Buffer.from(response.data).toString('base64');
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    // Save to MongoDB
    const newImage = new Image({ prompt, imageUrl });
    await newImage.save();

    res.json({ imageUrl, prompt });
  } catch (error) {
    console.error('Error generating image:', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to generate image', details: error.message });
  }
});

// API endpoint to get all generated images
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).json({ error: 'Failed to fetch images', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));