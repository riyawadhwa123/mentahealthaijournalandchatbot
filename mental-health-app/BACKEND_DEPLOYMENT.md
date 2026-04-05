# Backend Deployment Guide (Render)

## Environment Variables Required

Create these environment variables in your Render dashboard:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/mental-health-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

## Render Deployment Steps

1. **Connect GitHub Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub account
   - Select your repository

2. **Configure Build Settings**
   - **Name**: `mental-health-backend` (or your preferred name)
   - **Root Directory**: `backend` (since backend is in a subfolder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

3. **Environment Variables**
   - Add all the environment variables listed above
   - Make sure to replace placeholder values with your actual credentials

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - Note the generated URL (e.g., `https://your-backend-name.onrender.com`)

## Health Check

After deployment, test your backend by visiting:
`https://your-backend-name.onrender.com/api/health`

You should see a JSON response confirming the API is running. 