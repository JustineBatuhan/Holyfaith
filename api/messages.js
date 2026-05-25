import { authenticateToken } from './lib/auth.js';
import { db } from './lib/db.js';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
      res.json(db.getMessages());
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
