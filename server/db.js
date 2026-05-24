import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Resolve the db.json path relative to this script
// Note: Decode URL encoding if there are spaces in path on Windows
const dbFolder = path.join(process.cwd(), 'server');
const dbPath = path.join(dbFolder, 'db.json');

// Ensure db directory exists
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

// Default Seed Data
const defaultData = {
  settings: {
    churchName: "Holy Faith BCP Church",
    tagline: "WELCOME TO OUR COMMUNITY",
    description: "A place of peace, faith, and belonging — where every soul is welcome in Bacolod City.",
    heroBgImage: "https://images.unsplash.com/photo-1548625361-155de6c7f54d?auto=format&fit=crop&q=80&w=1600", // beautiful church default
    logoImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    aboutTitle: "Faith rooted in love & service",
    aboutQuote: "Come to me, all you who are weary and burdened, and I will give you rest.",
    aboutQuoteSource: "Matthew 11:28",
    aboutText: "Holy Faith BCP Church is a community united in worship, prayer, and fellowship. We welcome all who seek God's grace — whether you are returning or finding faith for the first time.",
    aboutImage: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800", // Church building style
    aboutQuoteBanner: "For where two or three gather in my name, there am I with them.",
    aboutQuoteBannerSource: "Matthew 18:20",
    storyTitle: "Our Story & Mission",
    storyText: "Holy Faith BCP Church was founded on the belief that every person deserves a spiritual home — a place where faith is nurtured, community is built, and God's love is made tangible in everyday life.\n\nWe follow the Book of Common Prayer tradition, grounded in Scripture, enriched by centuries of worship, and alive to the Spirit's movement today. Our liturgy is both ancient and accessible, connecting us to the worldwide Body of Christ.\n\nWhether you have walked with faith for decades or are taking your very first steps, you will find a home here — in prayer, in service, and in one another.",
    contactAddress: "Bacolod City, Philippines",
    contactPhone: "+63 34 123 4567",
    contactEmail: "info@holyfaithbcp.org",
    facebookUrl: "https://facebook.com",
    youtubeUrl: "https://youtube.com"
  },
  ministries: [
    {
      id: "1",
      title: "Bible Study",
      description: "Weekly deep dives into Scripture for all ages and backgrounds. Wednesdays at 7 PM.",
      icon: "BookOpen"
    },
    {
      id: "2",
      title: "Youth Ministry",
      description: "A vibrant space for young people to explore faith, build friendships, and grow in Christ.",
      icon: "Users"
    },
    {
      id: "3",
      title: "Women's Fellowship",
      description: "Monthly gatherings of encouragement, prayer, and sisterhood open to all women.",
      icon: "Heart"
    },
    {
      id: "4",
      title: "Choir & Worship",
      description: "Lead the congregation in praise. Rehearsals every Saturday morning at 9 AM.",
      icon: "Music"
    },
    {
      id: "5",
      title: "Outreach",
      description: "Serving our local community through food drives, visitations, and charity work.",
      icon: "Globe"
    },
    {
      id: "6",
      title: "Children's Church",
      description: "Nurturing the faith of our youngest members with age-appropriate worship and learning.",
      icon: "Baby"
    }
  ],
  events: [
    {
      id: "1",
      title: "Sunday Holy Eucharist",
      date: "2026-05-25",
      time: "7:00 AM & 9:30 AM",
      location: "Main Sanctuary",
      tag: "WORSHIP",
      description: "Join us for our main Sunday worship services with Communion."
    },
    {
      id: "2",
      title: "Midweek Bible Study",
      date: "2026-05-28",
      time: "7:00 PM",
      location: "Fellowship Hall",
      tag: "STUDY",
      description: "Weekly study and discussion of the scriptures."
    },
    {
      id: "3",
      title: "Community Outreach Day",
      date: "2026-06-01",
      time: "8:00 AM",
      location: "Church Grounds",
      tag: "OUTREACH",
      description: "Serving our neighbors together. Bring the family!"
    },
    {
      id: "4",
      title: "Youth Ministry Camp",
      date: "2026-06-08",
      time: "All day",
      location: "Church Hall",
      tag: "YOUTH",
      description: "Grades 7–12 summer fellowship camp."
    },
    {
      id: "5",
      title: "Women's Fellowship Gathering",
      date: "2026-06-15",
      time: "3:00 PM",
      location: "Parish Room",
      tag: "FELLOWSHIP",
      description: "A time of prayer and shared fellowship for the women of the parish."
    }
  ],
  messages: [],
  users: []
};

// Database read helper
function readDB() {
  try {
    if (!fs.existsSync(dbPath)) {
      // Seed initial data
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync("admin123", salt);
      
      const seedData = {
        ...defaultData,
        users: [{ username: 'admin', passwordHash }]
      };
      
      fs.writeFileSync(dbPath, JSON.stringify(seedData, null, 2), 'utf-8');
      return seedData;
    }
    
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Database reading failed, using defaults:", error);
    return defaultData;
  }
}

// Database write helper
function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Database writing failed:", error);
    return false;
  }
}

export const db = {
  // Settings
  getSettings: () => {
    return readDB().settings;
  },
  updateSettings: (newSettings) => {
    const data = readDB();
    data.settings = { ...data.settings, ...newSettings };
    writeDB(data);
    return data.settings;
  },

  // Ministries
  getMinistries: () => {
    return readDB().ministries;
  },
  addMinistry: (ministry) => {
    const data = readDB();
    const newMinistry = {
      id: Date.now().toString(),
      ...ministry
    };
    data.ministries.push(newMinistry);
    writeDB(data);
    return newMinistry;
  },
  updateMinistry: (id, updatedDetails) => {
    const data = readDB();
    const idx = data.ministries.findIndex(m => m.id === id);
    if (idx !== -1) {
      data.ministries[idx] = { ...data.ministries[idx], ...updatedDetails, id };
      writeDB(data);
      return data.ministries[idx];
    }
    return null;
  },
  deleteMinistry: (id) => {
    const data = readDB();
    const filtered = data.ministries.filter(m => m.id !== id);
    if (filtered.length !== data.ministries.length) {
      data.ministries = filtered;
      writeDB(data);
      return true;
    }
    return false;
  },

  // Events
  getEvents: () => {
    return readDB().events;
  },
  addEvent: (event) => {
    const data = readDB();
    const newEvent = {
      id: Date.now().toString(),
      ...event
    };
    data.events.push(newEvent);
    writeDB(data);
    return newEvent;
  },
  updateEvent: (id, updatedDetails) => {
    const data = readDB();
    const idx = data.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      data.events[idx] = { ...data.events[idx], ...updatedDetails, id };
      writeDB(data);
      return data.events[idx];
    }
    return null;
  },
  deleteEvent: (id) => {
    const data = readDB();
    const filtered = data.events.filter(e => e.id !== id);
    if (filtered.length !== data.events.length) {
      data.events = filtered;
      writeDB(data);
      return true;
    }
    return false;
  },

  // Messages
  getMessages: () => {
    return readDB().messages;
  },
  addMessage: (message) => {
    const data = readDB();
    const newMessage = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
      ...message
    };
    data.messages.unshift(newMessage); // put new messages on top
    writeDB(data);
    return newMessage;
  },
  markMessageRead: (id) => {
    const data = readDB();
    const idx = data.messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      data.messages[idx].read = true;
      writeDB(data);
      return data.messages[idx];
    }
    return null;
  },
  deleteMessage: (id) => {
    const data = readDB();
    const filtered = data.messages.filter(m => m.id !== id);
    if (filtered.length !== data.messages.length) {
      data.messages = filtered;
      writeDB(data);
      return true;
    }
    return false;
  },

  // Users & Auth
  validateUser: (username, password) => {
    const data = readDB();
    const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return false;
    return bcrypt.compareSync(password, user.passwordHash);
  },
  changePassword: (username, currentPassword, newPassword) => {
    const data = readDB();
    const userIdx = data.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (userIdx === -1) return { success: false, message: "User not found" };

    const user = data.users[userIdx];
    if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
      return { success: false, message: "Incorrect current password" };
    }

    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);
    writeDB(data);
    return { success: true, message: "Password updated successfully" };
  }
};
