#!/bin/bash

echo "🚀 Mental Health App Deployment Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git and push to GitHub first."
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit and push before deploying."
    echo "Run: git add . && git commit -m 'Deploy preparation' && git push"
    exit 1
fi

echo "✅ Repository is ready for deployment"
echo ""

echo "📋 Deployment Checklist:"
echo "1. Backend (Render):"
echo "   - Go to https://dashboard.render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set Root Directory to: backend"
echo "   - Add environment variables:"
echo "     * MONGODB_URI=your_mongodb_atlas_connection_string"
echo "     * JWT_SECRET=your_long_random_secret"
echo "     * NODE_ENV=production"
echo "   - Deploy and note the URL"
echo ""

echo "2. Frontend (Vercel):"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Create new project"
echo "   - Import your GitHub repository"
echo "   - Add environment variable:"
echo "     * NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com"
echo "   - Deploy and note the URL"
echo ""

echo "3. Update Backend CORS:"
echo "   - Go back to Render dashboard"
echo "   - Add environment variable:"
echo "     * FRONTEND_URL=https://your-app-name.vercel.app"
echo "   - Redeploy backend"
echo ""

echo "4. Test the application:"
echo "   - Visit your Vercel URL"
echo "   - Test registration, login, and all features"
echo ""

echo "📚 For detailed instructions, see:"
echo "- BACKEND_DEPLOYMENT.md"
echo "- FRONTEND_DEPLOYMENT.md"
echo "- DEPLOYMENT_CHECKLIST.md"
echo ""

echo "🎯 Good luck with your deployment!" 