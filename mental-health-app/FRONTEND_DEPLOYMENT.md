# Frontend Deployment Guide (Vercel)

## Environment Variables Required

Create these environment variables in your Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
```

## Vercel Deployment Steps

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure Build Settings**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (root of the project)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Environment Variables**
   - Add `NEXT_PUBLIC_API_URL` with your Render backend URL
   - Example: `https://your-backend-name.onrender.com`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend
   - You'll get a URL like: `https://your-app-name.vercel.app`

## Post-Deployment Steps

1. **Update Backend CORS**
   - Go back to your Render backend dashboard
   - Update the `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy the backend

2. **Test the Application**
   - Visit your Vercel URL
   - Test registration, login, and all features
   - Check that API calls work correctly

## Custom Domain (Optional)

1. **Add Custom Domain**
   - In Vercel dashboard, go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - Update `NEXT_PUBLIC_API_URL` if needed
   - Update backend `FRONTEND_URL` with new domain

## Troubleshooting

- **API Connection Issues**: Check that `NEXT_PUBLIC_API_URL` is correct
- **CORS Errors**: Ensure backend `FRONTEND_URL` matches your Vercel domain
- **Build Failures**: Check Vercel build logs for dependency issues 