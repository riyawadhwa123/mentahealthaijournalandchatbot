# MongoDB Testing Guide for AI Interviewer

This guide will help you demonstrate that your MongoDB is working correctly during your AI interview.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Backend dependencies installed

### 2. Setup
```bash
# Navigate to backend directory
cd mental-health-app/backend

# Install dependencies
npm install

# Create .env file (copy from env.example)
cp env.example .env

# Edit .env file with your MongoDB URI
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mental-health-app
```

## 🧪 Testing Methods

### Method 1: Direct MongoDB Test (Recommended)
This tests MongoDB connection and operations directly:

```bash
node test-mongodb.js
```

**Expected Output:**
```
🔍 MongoDB Connection Test Starting...

1️⃣ Testing MongoDB Connection...
✅ MongoDB Connected Successfully!
📍 Connection String: mongodb+srv://***:***@cluster.mongodb.net/mental-health-app
🏠 Database: mental-health-app
🔌 Host: cluster.mongodb.net
🚪 Port: 27017

2️⃣ Testing Database Operations...
✅ Document inserted successfully
📄 Inserted ID: 507f1f77bcf86cd799439011
✅ Document read successfully
📖 Retrieved: { "_id": "507f1f77bcf86cd799439011", "message": "Hello from MongoDB test!", ... }
✅ Document updated successfully
✏️ Modified count: 1
✅ Document deleted successfully
🗑️ Deleted count: 1

3️⃣ Checking Existing Collections...
📚 Found 4 collections:
   - users
   - journals
   - moods
   - chats

4️⃣ Database Statistics...
📊 Database: mental-health-app
📁 Collections: 4
📄 Documents: 25
💾 Data Size: 0.15 MB
🗄️ Storage Size: 0.25 MB

5️⃣ Connection Health Check...
🖥️ Server Version: 7.0.4
⏱️ Uptime: 168 hours
🔗 Active Connections: 5
💾 Memory Usage: 45.67 MB

🎉 All MongoDB tests passed successfully!
✅ Your MongoDB is working perfectly for the interview!
```

### Method 2: Server Integration Test
This tests MongoDB through your Express server:

```bash
# First, start your server
npm run dev

# In another terminal, run the server check
node check-server.js
```

**Expected Output:**
```
🔍 Checking Backend Server Status...

1️⃣ Testing Server Health Endpoint...
✅ Server is running!
📊 Status: OK
💬 Message: Mental Health App API is running
🌍 Environment: development
⏰ Timestamp: 2024-01-15T10:30:00.000Z

2️⃣ Testing MongoDB through Server...
✅ MongoDB is working through the server!
👤 Test user created: test-user-1705312200000
🧹 Cleaning up test user...
ℹ️ Test user created successfully - consider manual cleanup if needed

🎉 Server and MongoDB are working correctly!
✅ Ready for your AI interviewer!
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Connection Failed
**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solutions:**
- Check if MONGODB_URI is correct in `.env` file
- Verify your IP is whitelisted in MongoDB Atlas
- Ensure your MongoDB cluster is running

#### 2. Authentication Failed
**Error:** `MongoServerError: Authentication failed`

**Solutions:**
- Verify username/password in connection string
- Check if user has proper permissions
- Ensure database name is correct

#### 3. Server Not Running
**Error:** `ECONNREFUSED` when running `check-server.js`

**Solutions:**
```bash
# Start the server
npm run dev

# Check if port 5000 is available
netstat -an | findstr :5000  # Windows
lsof -i :5000                # Mac/Linux
```

## 📊 What the Tests Verify

### Direct MongoDB Test (`test-mongodb.js`)
- ✅ Connection to MongoDB Atlas
- ✅ Database authentication
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Collection management
- ✅ Database statistics
- ✅ Server health metrics

### Server Integration Test (`check-server.js`)
- ✅ Express server is running
- ✅ Health endpoint is accessible
- ✅ MongoDB operations through API
- ✅ User registration functionality
- ✅ Error handling

## 🎯 Interview Tips

### What to Show Your AI Interviewer:

1. **Run the direct test first:**
   ```bash
   node test-mongodb.js
   ```
   This shows comprehensive MongoDB functionality.

2. **Demonstrate server integration:**
   ```bash
   # Terminal 1: Start server
   npm run dev
   
   # Terminal 2: Test server
   node check-server.js
   ```
   This shows your full-stack application working.

3. **Show your database collections:**
   - Point out the collections in the test output
   - Explain your data models (users, journals, moods, chats)

4. **Highlight key features:**
   - Connection string security (credentials masked)
   - Error handling and troubleshooting
   - Database statistics and health metrics

### Key Points to Mention:

- **MongoDB Atlas:** Cloud-hosted, scalable database
- **Mongoose ODM:** Object Document Mapping for Node.js
- **Environment Variables:** Secure configuration management
- **Connection Pooling:** Efficient database connections
- **Error Handling:** Robust error management
- **Health Monitoring:** Database and server status checks

## 🚨 Emergency Commands

If something goes wrong during the interview:

```bash
# Quick connection test
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected!')).catch(e => console.log('❌ Failed:', e.message))"

# Check if server is running
curl http://localhost:5000/api/health

# Restart server
npm run dev
```

## 📝 Notes for Interviewer

- All tests are non-destructive (clean up after themselves)
- Tests show both direct MongoDB operations and API integration
- Error messages provide helpful debugging information
- The setup demonstrates production-ready practices
- Environment variables keep credentials secure

Good luck with your interview! 🎉 