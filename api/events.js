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
      const { title, date, location, description, image } = req.body;

      if (!title || !date || !location) {
        return res.status(400).json({ message: "Title, date, and location are required" });
      }

      const newEvent = db.addEvent({ 
        title, 
        date, 
        location, 
        description: description || '', 
        image: image || '' 
      });

      res.status(201).json({ 
        message: "Event created successfully", 
        event: newEvent 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create event" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
