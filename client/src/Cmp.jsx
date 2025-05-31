import { useState, useEffect } from 'react';
import axios from 'axios';

function Cmp() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all images on mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/images');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load gallery');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/generate-image', { prompt });
      setImageUrl(response.data.imageUrl);
      fetchImages(); // Refresh gallery
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error.response?.data?.details || 'Failed to generate image');
    }
    setLoading(false);
  };

  return (
    <div className="Cmp">
      <h1>Text-to-Image Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt (e.g., 'A serene sunset over a mountain lake')"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {imageUrl && (
        <div>
          <h2>Generated Image</h2>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: '500px' }} />
        </div>
      )}

      <h2>Image Gallery</h2>
      <div className="gallery">
        {images.length === 0 ? (
          <p>No images yet</p>
        ) : (
          images.map((img) => (
            <div key={img._id} className="gallery-item">
              <img src={img.imageUrl} alt={img.prompt} />
              <p>{img.prompt}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Cmp;