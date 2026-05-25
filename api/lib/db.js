import bcrypt from 'bcryptjs';

// In-memory database for Vercel (doesn't persist between deployments)
// For production, consider: Firebase, Supabase, MongoDB Atlas, etc.
let data = {
  settings: {
    churchName: "Holy Faith BCP Church",
    tagline: "WELCOME TO OUR COMMUNITY",
    description: "A place of peace, faith, and belonging — where every soul is welcome in Bacolod City.",
    heroBgImage: "https://images.unsplash.com/photo-1548625361-155de6c7f54d?auto=format&fit=crop&q=80&w=1600",
    logoImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    aboutTitle: "Faith rooted in love & service",
    aboutQuote: "Come to me, all you who are weary and burdened, and I will give you rest.",
    aboutQuoteSource: "Matthew 11:28",
    aboutText: "Holy Faith BCP Church is a community united in worship, prayer, and fellowship. We welcome all who seek God's grace — whether you are returning or finding faith for the first time.",
    aboutImage: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800",
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
    }
  ],
  events: [
    {
      id: "1",
      title: "Sunday Worship Service",
      date: "2025-06-01T10:00:00Z",
      location: "Main Sanctuary",
      description: "Weekly service with hymns, prayers, and message.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
    }
  ],
  messages: [],
  users: [
    {
      username: "admin",
      passwordHash: bcrypt.hashSync("admin123", 10)
    }
  ]
};

export const db = {
  getSettings: () => data.settings,
  updateSettings: (newSettings) => {
    data.settings = { ...data.settings, ...newSettings };
    return data.settings;
  },
  
  getMinistries: () => data.ministries,
  addMinistry: (ministry) => {
    const newMinistry = { ...ministry, id: Date.now().toString() };
    data.ministries.push(newMinistry);
    return newMinistry;
  },
  updateMinistry: (id, updates) => {
    const ministry = data.ministries.find(m => m.id === id);
    if (!ministry) return null;
    Object.assign(ministry, updates);
    return ministry;
  },
  deleteMinistry: (id) => {
    data.ministries = data.ministries.filter(m => m.id !== id);
    return true;
  },
  
  getEvents: () => data.events,
  addEvent: (event) => {
    const newEvent = { ...event, id: Date.now().toString() };
    data.events.push(newEvent);
    return newEvent;
  },
  updateEvent: (id, updates) => {
    const event = data.events.find(e => e.id === id);
    if (!event) return null;
    Object.assign(event, updates);
    return event;
  },
  deleteEvent: (id) => {
    data.events = data.events.filter(e => e.id !== id);
    return true;
  },
  
  getMessages: () => data.messages,
  addMessage: (message) => {
    const newMessage = { ...message, id: Date.now().toString(), read: false, createdAt: new Date().toISOString() };
    data.messages.push(newMessage);
    return newMessage;
  },
  markMessageRead: (id) => {
    const message = data.messages.find(m => m.id === id);
    if (!message) return null;
    message.read = true;
    return message;
  },
  deleteMessage: (id) => {
    data.messages = data.messages.filter(m => m.id !== id);
    return true;
  },
  
  validateUser: (username, password) => {
    const user = data.users.find(u => u.username === username);
    if (!user) return false;
    return bcrypt.compareSync(password, user.passwordHash);
  },
  changePassword: (username, currentPassword, newPassword) => {
    const user = data.users.find(u => u.username === username);
    if (!user) return { success: false, message: "User not found" };
    
    if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
      return { success: false, message: "Current password is incorrect" };
    }
    
    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    return { success: true, message: "Password changed successfully" };
  }
};
