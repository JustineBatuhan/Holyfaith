# Vercel Functions Setup for Church Website

This project is now configured to deploy to Vercel using Serverless Functions instead of a traditional Express server.

## Key Changes

✅ **Migrated from Express.js to Vercel Functions**
- All API routes are now serverless functions in `/api` directory
- No more server.js or backend uptime issues
- Automatic scaling on Vercel

✅ **Database Migration**
- Uses in-memory storage (resets on deployment)
- **For production:** Use Firebase, Supabase, MongoDB Atlas, or PostgreSQL

✅ **File Uploads**
- Configured for Cloudinary (recommended)
- Alternative: Vercel Blob Storage, AWS S3, or similar

## Setup Instructions

### 1. Set Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_API_URL=/api
JWT_SECRET=your-super-secret-key-change-this-in-production
```

On Vercel Dashboard:
- Go to Settings → Environment Variables
- Add: `JWT_SECRET` with a secure random string

### 2. File Upload Setup (Cloudinary)

#### Install Cloudinary:
```bash
npm install next-cloudinary
```

#### Get Cloudinary Credentials:
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Copy your: Cloud Name, API Key, API Secret

#### Add to Environment Variables:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

On Vercel Dashboard, also add these as public environment variables.

#### Update `/api/upload.js`:

Replace the placeholder upload function with:

```javascript
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from './lib/auth.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const auth = authenticateToken(req);
  if (auth.error) {
    return res.status(auth.status).json({ message: auth.error });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Handle base64 or file upload
    const { image } = req.body;
    
    const result = await cloudinary.uploader.upload(image, {
      folder: 'church-web',
      resource_type: 'auto'
    });

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

### 3. Deploy to Vercel

#### Option A: Git Integration (Recommended)
```bash
# Push to GitHub/GitLab/Bitbucket
git push origin main

# Vercel auto-deploys on push
```

#### Option B: Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Option C: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Connect your Git repository
4. Add Environment Variables in Settings
5. Deploy

## Important Notes

⚠️ **Database Persistence:**
- Current in-memory database resets on each deployment
- Production requires a proper database:
  - Firebase Realtime Database
  - Supabase (PostgreSQL)
  - MongoDB Atlas
  - AWS DynamoDB

⚠️ **Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`
- **Change immediately in production!**

Modify in `/api/lib/db.js`:
```javascript
users: [
  {
    username: "your_username",
    passwordHash: bcrypt.hashSync("secure_password", 10)
  }
]
```

⚠️ **JWT_SECRET:**
- Must be set in Vercel Environment Variables
- Use a strong, random string (32+ characters)
- Different from local development secret

## Development Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Production Deployment Checklist

- [ ] Set `JWT_SECRET` environment variable
- [ ] Configure Cloudinary credentials
- [ ] Test all API endpoints
- [ ] Change default admin credentials
- [ ] Set up database persistence
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up domain (optional)
- [ ] Monitor function logs on Vercel Dashboard

## API Endpoints

All endpoints available at `https://your-domain/api/`

### Public:
- `GET /api/public-data` - Settings, ministries, events
- `POST /api/contact` - Contact form submission
- `POST /api/auth/login` - Admin login

### Protected (requires JWT):
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/ministries`
- `PUT /api/ministries/[id]`
- `DELETE /api/ministries/[id]`
- `POST /api/events`
- `PUT /api/events/[id]`
- `DELETE /api/events/[id]`
- `GET /api/messages`
- `PATCH /api/messages/[id]/read`
- `DELETE /api/messages/[id]`
- `POST /api/upload` - File upload

## Troubleshooting

**404 Errors:** Ensure API routes are in `/api` directory

**CORS Issues:** Check CORS headers in function files

**Function Timeouts:** Increase in `vercel.json` (max 60s on Pro)

**Environment Variables Not Working:** Redeploy after adding variables

## Resources

- [Vercel Functions Docs](https://vercel.com/docs/functions/serverless-functions)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) (similar pattern)
