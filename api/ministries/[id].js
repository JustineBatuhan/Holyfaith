import { authenticateToken } from '../lib/auth.js';
import { db } from '../lib/db.js';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
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

  if (req.method === 'PUT') {
    try {
      const updated = db.updateMinistry(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Ministry not found" });
      }
      res.json({ message: "Ministry updated successfully", ministry: updated });
    } catch (error) {
      res.status(500).json({ message: "Failed to update ministry" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleted = db.deleteMinistry(id);
      if (!deleted) {
        return res.status(404).json({ message: "Ministry not found" });
      }
      res.json({ message: "Ministry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ministry" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
