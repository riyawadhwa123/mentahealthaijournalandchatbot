# How to View MongoDB Data

This guide shows you multiple ways to view your MongoDB data for your AI interviewer.

## 🚀 Quick Methods

### Method 1: View All Data (Recommended)
```bash
cd mental-health-app/backend
node view-mongodb-data.js
```

This shows:
- All collections and their document counts
- Sample documents from each collection
- Database statistics

### Method 2: View Specific Collection
```bash
# View users collection
node view-specific-collection.js users

# View journals collection
node view-specific-collection.js journals

# View moods collection
node view-specific-collection.js moods

# View chats collection
node view-specific-collection.js chats
```

## 🌐 Web-Based Methods

### Method 3: MongoDB Atlas Dashboard (Easiest)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in to your account
3. Click on your cluster
4. Click "Browse Collections"
5. Select your database: `mental-health-app`
6. Click on any collection to view data

**Benefits:**
- Visual interface
- Easy filtering and sorting
- Real-time data viewing
- No code required

### Method 4: MongoDB Compass (Desktop App)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install and open it
3. Connect using your connection string
4. Browse collections visually

## 💻 Command Line Methods

### Method 5: Direct MongoDB Shell
```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/mental-health-app"

# Show all databases
show dbs

# Use your database
use mental-health-app

# Show all collections
show collections

# View all documents in a collection
db.users.find()

# View documents in a nice format
db.users.find().pretty()

# Count documents
db.users.countDocuments()

# Find specific documents
db.users.find({email: "user@example.com"})
```

### Method 6: Quick Node.js Commands
```bash
# Quick connection test with data viewing
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('Users:', users.length);
    process.exit(0);
  })
  .catch(console.error);
"
```

## 📊 What You'll See

### Users Collection
- User registration data
- Email addresses (hashed passwords)
- Registration timestamps

### Journals Collection
- Journal entries
- User references
- Entry content and timestamps

### Moods Collection
- Mood tracking data
- Mood scores
- Timestamps

### Chats Collection
- Chat messages
- User conversations
- AI responses

## 🎯 For Your AI Interviewer

### What to Demonstrate:

1. **Show the data structure:**
   ```bash
   node view-mongodb-data.js
   ```

2. **Explain your collections:**
   - "Users collection stores user accounts"
   - "Journals collection stores diary entries"
   - "Moods collection tracks emotional states"
   - "Chats collection stores AI conversations"

3. **Highlight data security:**
   - "Passwords are hashed using bcrypt"
   - "User data is properly structured"
   - "Timestamps are automatically added"

4. **Show data relationships:**
   - "Users can have multiple journal entries"
   - "Mood tracking is linked to users"
   - "Chat history is preserved per user"

## 🔧 Troubleshooting

### If you can't see data:
1. Check if your `.env` file has the correct `MONGODB_URI`
2. Verify your IP is whitelisted in MongoDB Atlas
3. Ensure your database user has read permissions

### If collections are empty:
1. Try creating some test data through your app
2. Check if data is being saved correctly
3. Verify your API endpoints are working

## 📝 Quick Commands Reference

```bash
# View all data
node view-mongodb-data.js

# View specific collection
node view-specific-collection.js users

# Test connection
node test-mongodb.js

# Start your server
npm run dev

# Check server health
node check-server.js
```

## 🎉 Ready for Your Interview!

With these tools, you can easily show your AI interviewer:
- ✅ Your database structure
- ✅ Sample data
- ✅ Data relationships
- ✅ Security practices
- ✅ Professional setup

Good luck! 🚀 