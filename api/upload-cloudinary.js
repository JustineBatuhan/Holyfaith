import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from './lib/auth.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check authentication
  const auth = authenticateToken(req);
  if (auth.error) {
    return res.status(auth.status).json({ message: auth.error });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ message: "Image data is required" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      folder: 'holy-faith-church',
      resource_type: 'auto',
      width: 1200,
      crop: 'scale',
      quality: 'auto'
    });

    res.status(200).json({ 
      imageUrl: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: error.message || "Failed to upload file" });
  }
}
