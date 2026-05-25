import { authenticateToken } from './lib/auth.js';
import { db } from './lib/db.js';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
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

  if (req.method === 'GET') {
    try {
      res.json(db.getSettings());
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  } else if (req.method === 'PUT') {
    try {
      const updated = db.updateSettings(req.body);
      res.json({ message: "Settings updated successfully", settings: updated });
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
