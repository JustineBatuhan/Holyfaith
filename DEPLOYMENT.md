# Quick Deployment to Vercel

## Step 1: Prepare Your Repository

```bash
# Make sure everything is committed
git add .
git commit -m "Convert to Vercel Functions"
git push origin main
```

## Step 2: Deploy via Vercel

### Option 1: Automatic (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your repository
5. Click "Import"

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel
```

## Step 3: Add Environment Variables

**On Vercel Dashboard:**

1. Go to your project
2. Click "Settings"
3. Select "Environment Variables"
4. Add these variables:

| Name | Value | Type |
|------|-------|------|
| `JWT_SECRET` | [generate random string] | Sensitive |
| `CLOUDINARY_CLOUD_NAME` | your-cloud-name | Public |
| `CLOUDINARY_API_KEY` | your-api-key | Public |
| `CLOUDINARY_API_SECRET` | your-api-secret | Sensitive |

**Generate JWT_SECRET:**
- Use an online tool: https://www.cryptool.org
- Or use your terminal (see .env.example)

## Step 4: Verify Deployment

Once deployed, you'll get a URL like: `https://your-project.vercel.app`

Test it:
```bash
curl https://your-project.vercel.app/api/public-data
```

## Step 5: Connect Custom Domain (Optional)

1. In Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Update DNS records (instructions provided)

## Troubleshooting

### Functions showing 404
- ✅ Ensure `/api` folder exists at project root
- ✅ Files must be `.js` (not `.ts` for now)

### Environment variables not working
- ✅ Redeploy after adding variables
- ✅ Check they're set for the right environment (Production)

### API calls failing
- ✅ Check function logs in Vercel Dashboard → Functions
- ✅ Verify CORS headers (already set in functions)

### Database resets after deploy
- This is expected! To persist data:
  - Upgrade to use Firebase/Supabase
  - See VERCEL_SETUP.md for details

## Monitor Your Site

**Vercel Dashboard shows:**
- Function execution logs
- Performance metrics
- Deployment history
- Error tracking

Click on your project → "Analytics" to see traffic and performance.

## Next Steps

1. ✅ Test all admin features
2. ✅ Verify file uploads with Cloudinary
3. ✅ Test on mobile
4. ✅ Set up custom domain
5. ✅ Move to proper database for production

---

**Need help?** Check VERCEL_SETUP.md for detailed configuration instructions.
