# 🚀 Full-Stack Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All localhost URLs updated to use environment variables
- [ ] Environment variables properly configured
- [ ] CORS settings updated for production
- [ ] Database connection string ready
- [ ] JWT secret configured
- [ ] API endpoints tested locally

### ✅ Repository Setup
- [ ] Code pushed to GitHub repository
- [ ] Repository is public or connected to deployment platforms
- [ ] No sensitive data in repository (check .gitignore)
- [ ] README.md updated with deployment instructions

## 🔧 Backend Deployment (Render)

### ✅ Environment Variables
- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Long, random secret key
- [ ] `FRONTEND_URL` - Will be set after frontend deployment
- [ ] `NODE_ENV` - Set to "production"

### ✅ Render Configuration
- [ ] Connected GitHub repository
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment variables added
- [ ] Service deployed successfully

### ✅ Backend Testing
- [ ] Health check endpoint working: `/api/health`
- [ ] API responds correctly
- [ ] Database connection established
- [ ] CORS working (test with frontend)

## 🌐 Frontend Deployment (Vercel)

### ✅ Environment Variables
- [ ] `NEXT_PUBLIC_API_URL` - Your Render backend URL

### ✅ Vercel Configuration
- [ ] Connected GitHub repository
- [ ] Framework: Next.js (auto-detected)
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Frontend deployed successfully

### ✅ Frontend Testing
- [ ] Application loads without errors
- [ ] API calls working correctly
- [ ] Authentication working
- [ ] All features functional

## 🔄 Post-Deployment Configuration

### ✅ CORS Update
- [ ] Backend `FRONTEND_URL` updated with Vercel domain
- [ ] Backend redeployed
- [ ] CORS errors resolved

### ✅ Final Testing
- [ ] User registration works
- [ ] User login works
- [ ] Journal entries can be created/read/deleted
- [ ] Mood entries can be created/read/deleted
- [ ] Chat functionality works
- [ ] Dashboard displays correctly
- [ ] All CRUD operations functional

## 🔒 Security Checklist

### ✅ Environment Variables
- [ ] No sensitive data in code
- [ ] All secrets in environment variables
- [ ] JWT secret is strong and unique
- [ ] Database credentials secure

### ✅ CORS Configuration
- [ ] Only allowed domains can access API
- [ ] No wildcard (*) origins in production
- [ ] Credentials properly configured

### ✅ API Security
- [ ] Authentication middleware working
- [ ] Protected routes secured
- [ ] Input validation in place
- [ ] Error handling doesn't expose sensitive data

## 📊 Monitoring & Maintenance

### ✅ Health Monitoring
- [ ] Health check endpoints working
- [ ] Error logging configured
- [ ] Performance monitoring set up (optional)

### ✅ Backup Strategy
- [ ] Database backups configured
- [ ] Code repository backed up
- [ ] Environment variables documented

## 🎯 Deployment URLs

### Backend (Render)
- URL: `https://your-backend-name.onrender.com`
- Health Check: `https://your-backend-name.onrender.com/api/health`

### Frontend (Vercel)
- URL: `https://your-app-name.vercel.app`

### Database (MongoDB Atlas)
- Connection: `mongodb+srv://...`

## 🚨 Troubleshooting

### Common Issues
- **CORS Errors**: Check FRONTEND_URL in backend environment variables
- **API Connection**: Verify NEXT_PUBLIC_API_URL in frontend
- **Build Failures**: Check dependency versions and build logs
- **Database Connection**: Verify MONGODB_URI format and network access

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/) 