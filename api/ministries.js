import { authenticateToken } from './lib/auth.js';
import { db } from './lib/db.js';

export default function handler(req, res) {
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

  if (req.method === 'POST') {
    try {
      const { title, description, icon } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
      }

      const newMinistry = db.addMinistry({ 
        title, 
        description, 
        icon: icon || 'BookOpen' 
      });

      res.status(201).json({ 
        message: "Ministry created successfully", 
        ministry: newMinistry 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create ministry" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
