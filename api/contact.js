import { db } from './lib/db.js';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const newMessage = db.addMessage({ name, email, subject: subject || 'General Inquiry', message });
    res.status(201).json({ message: "Message sent successfully!", data: newMessage });
  } catch (error) {
    console.error("Error submitting message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
}
