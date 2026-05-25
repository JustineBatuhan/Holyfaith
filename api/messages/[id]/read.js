import { authenticateToken } from '../../lib/auth.js';
import { db } from '../../lib/db.js';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
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

  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const message = db.markMessageRead(id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message marked as read", data: message });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
