import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { db } from './db.js';
import { authenticateToken, JWT_SECRET } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors());

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup image upload storage using multer
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `church-media-${uniqueSuffix}${ext}`);
  }
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Serve uploaded files statically under /uploads
app.use('/uploads', express.static(uploadDir));

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// Get all website settings, ministries, and events in a single payload
app.get('/api/public-data', (req, res) => {
  try {
    const settings = db.getSettings();
    const ministries = db.getMinistries();
    const events = db.getEvents();
    
    res.json({
      settings,
      ministries,
      events
    });
  } catch (error) {
    console.error("Error fetching public data:", error);
    res.status(500).json({ message: "Failed to fetch website data" });
  }
});

// Handle contact form submission
app.post('/api/contact', (req, res) => {
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
});

// ==========================================
// ADMIN AUTH ENDPOINTS
// ==========================================

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const isValid = db.validateUser(username, password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Generate token valid for 24 hours
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      success: true,
      token,
      user: { username }
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Change Password endpoint (Protected)
app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }
    
    const result = db.changePassword(req.user.username, currentPassword, newPassword);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.json({ message: result.message });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
});

// ==========================================
// PROTECTED API ENDPOINTS (ADMIN ONLY)
// ==========================================

// --- File Upload Endpoint ---
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    // Return relative URL that can be requested from the front-end
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: error.message || "Failed to upload file" });
  }
});

// --- Settings Operations ---
app.get('/api/settings', authenticateToken, (req, res) => {
  res.json(db.getSettings());
});

app.put('/api/settings', authenticateToken, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ message: "Settings updated successfully", settings: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
});

// --- Ministries Operations ---
app.post('/api/ministries', authenticateToken, (req, res) => {
  try {
    const { title, description, icon } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const newMinistry = db.addMinistry({ title, description, icon: icon || 'BookOpen' });
    res.status(201).json({ message: "Ministry created successfully", ministry: newMinistry });
  } catch (error) {
    res.status(500).json({ message: "Failed to create ministry" });
  }
});

app.put('/api/ministries/:id', authenticateToken, (req, res) => {
  try {
    const updated = db.updateMinistry(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Ministry not found" });
    }
    res.json({ message: "Ministry updated successfully", ministry: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update ministry" });
  }
});

app.delete('/api/ministries/:id', authenticateToken, (req, res) => {
  try {
    const success = db.deleteMinistry(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Ministry not found" });
    }
    res.json({ message: "Ministry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ministry" });
  }
});

// --- Events Operations ---
app.post('/api/events', authenticateToken, (req, res) => {
  try {
    const { title, date, time, location, tag, description } = req.body;
    if (!title || !date || !time) {
      return res.status(400).json({ message: "Title, date, and time are required" });
    }
    const newEvent = db.addEvent({ 
      title, 
      date, 
      time, 
      location: location || 'Main Sanctuary', 
      tag: tag || 'WORSHIP', 
      description 
    });
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Failed to create event" });
  }
});

app.put('/api/events/:id', authenticateToken, (req, res) => {
  try {
    const updated = db.updateEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event updated successfully", event: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update event" });
  }
});

app.delete('/api/events/:id', authenticateToken, (req, res) => {
  try {
    const success = db.deleteEvent(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event" });
  }
});

// --- Inbox Messages Operations ---
app.get('/api/messages', authenticateToken, (req, res) => {
  res.json(db.getMessages());
});

app.patch('/api/messages/:id/read', authenticateToken, (req, res) => {
  try {
    const updated = db.markMessageRead(req.params.id);
    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message marked as read", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update message" });
  }
});

app.delete('/api/messages/:id', authenticateToken, (req, res) => {
  try {
    const success = db.deleteMessage(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

// ==========================================
// SPA PRODUCTION BUILD ROUTING
// ==========================================

const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Fallback route for React Router SPA
  app.get('*', (req, res, next) => {
    // If request is API or upload path, pass through to 404
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start the Express app
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  Holy Faith Church backend listening on port ${PORT}`);
  console.log(`==================================================`);
});
