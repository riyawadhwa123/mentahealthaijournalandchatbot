# 🔄 Complete Project Workflow - From Start to Finish

## 📖 Table of Contents
1. [System Startup Workflow](#1-system-startup-workflow)
2. [User Registration Workflow](#2-user-registration-workflow)
3. [User Login Workflow](#3-user-login-workflow)
4. [Dashboard Loading Workflow](#4-dashboard-loading-workflow)
5. [Journal Entry Creation Workflow](#5-journal-entry-creation-workflow)
6. [Mood Logging Workflow](#6-mood-logging-workflow)
7. [AI Chatbot Conversation Workflow](#7-ai-chatbot-conversation-workflow)
8. [Mood Trends & Analytics Workflow](#8-mood-trends--analytics-workflow)
9. [Complete User Journey (Day in the Life)](#9-complete-user-journey-day-in-the-life)
10. [Behind the Scenes: Technical Workflow](#10-behind-the-scenes-technical-workflow)

---

## 1. SYSTEM STARTUP WORKFLOW

### **When the Application Starts**

```
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND STARTUP                            │
└─────────────────────────────────────────────────────────────┘

Step 1: Load Environment Variables
├─ Read .env file
├─ Load: MONGODB_URI, JWT_SECRET, OLLAMA_URL, etc.
└─ Validate required variables exist

Step 2: Initialize Express Server
├─ Create Express app instance
├─ Configure middleware:
│  ├─ CORS (allow frontend origins)
│  ├─ express.json() (parse JSON bodies)
│  └─ express.urlencoded() (parse form data)
└─ Set PORT = 5000 (or process.env.PORT)

Step 3: Connect to MongoDB
├─ Call: mongoose.connect(MONGODB_URI)
├─ Mongoose establishes connection pool
├─ Wait for 'connected' event
└─ Log: "Connected to MongoDB" ✓

Step 4: Register Routes
├─ Mount: /api/auth → auth routes (login, register)
├─ Mount: /api/journal → journal routes (CRUD)
├─ Mount: /api/mood → mood routes (tracking)
└─ Mount: /api/chat → chat routes (AI integration)

Step 5: Start HTTP Server
├─ Listen on PORT 5000
├─ Log: "Server is running on port 5000"
└─ Ready to accept requests ✓

┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND STARTUP                           │
└─────────────────────────────────────────────────────────────┘

Step 1: Next.js Initialization
├─ Load environment variables (NEXT_PUBLIC_API_URL)
├─ Build React component tree
└─ Server-side render initial page

Step 2: Browser Loads Application
├─ Download HTML, CSS, JavaScript bundles
├─ React hydrates the page (makes it interactive)
└─ Check localStorage for existing JWT token

Step 3: Route Based on Authentication
├─ If token exists → Redirect to /dashboard
└─ If no token → Show landing page (/)

Step 4: Application Ready
└─ User can now interact with the app ✓
```

---

## 2. USER REGISTRATION WORKFLOW

### **Creating a New Account**

```
🎬 USER ACTION: Clicks "Sign Up" button on landing page

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Navigate to Registration Page                       │
└─────────────────────────────────────────────────────────────┘
├─ Browser: Navigate to /register
├─ Next.js: Render RegisterPage component
└─ Display: Email, Password, Name input fields


┌─────────────────────────────────────────────────────────────┐
│ STEP 2: User Fills Out Form                                 │
└─────────────────────────────────────────────────────────────┘
User types:
├─ Email: john.doe@example.com
├─ Password: SecurePass123!
└─ Name: John Doe


┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Form Submission (Frontend)                          │
└─────────────────────────────────────────────────────────────┘
User clicks "Register" button
│
├─ Frontend Validation:
│  ├─ Check all fields are filled ✓
│  ├─ Check email format (contains @) ✓
│  └─ Check password length (min 6 chars) ✓
│
├─ Disable submit button (prevent double-click)
├─ Show loading spinner
└─ Make API Call ↓


┌─────────────────────────────────────────────────────────────┐
│ STEP 4: API Request to Backend                              │
└─────────────────────────────────────────────────────────────┘
POST http://localhost:5000/api/auth/register
Headers: { Content-Type: 'application/json' }
Body: {
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Backend Processing (Express Server)                 │
└─────────────────────────────────────────────────────────────┘
backend/src/routes/auth.js → POST /register handler

A. Validate Input
   ├─ Check if email, password, name are provided
   ├─ If missing → Return 400 "All fields are required"
   └─ Continue ✓

B. Check if User Already Exists
   ├─ Query: User.findOne({ email: "john.doe@example.com" })
   ├─ If found → Return 400 "Email already registered"
   └─ Not found → Continue ✓

C. Hash Password
   ├─ Call: bcrypt.hash("SecurePass123!", 10)
   ├─ Process: Run 2^10 (1024) hashing iterations
   ├─ Result: "$2b$10$N9qo8uLO...64chars" (hashed password)
   └─ Time: ~100ms ✓

D. Create User Document
   ├─ Create: new User({
   │    email: "john.doe@example.com",
   │    password: "$2b$10$N9qo8uLO...",  // hashed
   │    name: "John Doe"
   │  })
   └─ MongoDB auto-generates: _id, createdAt

E. Save to Database
   ├─ Call: user.save()
   ├─ MongoDB: Insert document into 'users' collection
   ├─ Unique email index checked ✓
   └─ Success ✓


┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Backend Response                                    │
└─────────────────────────────────────────────────────────────┘
Status: 201 Created
Body: { 
  "message": "User registered successfully." 
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Frontend Handles Response                           │
└─────────────────────────────────────────────────────────────┘
├─ Receive 201 response ✓
├─ Hide loading spinner
├─ Show success message: "Account created! Please login."
└─ Redirect to /login page


✅ REGISTRATION COMPLETE - User account created in database
```

---

## 3. USER LOGIN WORKFLOW

### **Authenticating & Getting JWT Token**

```
🎬 USER ACTION: Enters credentials and clicks "Login"

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User on Login Page                                  │
└─────────────────────────────────────────────────────────────┘
User enters:
├─ Email: john.doe@example.com
└─ Password: SecurePass123!


┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Frontend Login Request                              │
└─────────────────────────────────────────────────────────────┘
POST http://localhost:5000/api/auth/login
Headers: { Content-Type: 'application/json' }
Body: {
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Backend Authentication Process                      │
└─────────────────────────────────────────────────────────────┘
backend/src/routes/auth.js → POST /login handler

A. Find User by Email
   ├─ Query: User.findOne({ email: "john.doe@example.com" })
   ├─ MongoDB: Use email index for fast lookup
   └─ Result: User document found ✓

B. Verify Password
   ├─ Call: bcrypt.compare("SecurePass123!", user.password)
   ├─ Process: Hash input password and compare with stored hash
   ├─ Time: ~100ms
   └─ Result: Match ✓ (if no match → Return 401 "Invalid credentials")

C. Generate JWT Token
   ├─ Create payload: { userId: user._id }
   ├─ Sign with secret: process.env.JWT_SECRET
   ├─ Set expiration: 7 days (604800 seconds)
   │
   │  jwt.sign(
   │    { userId: "507f1f77bcf86cd799439011" },
   │    JWT_SECRET,
   │    { expiresIn: '7d' }
   │  )
   │
   └─ Result: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQ..." ✓

D. Prepare User Info (without password!)
   └─ Extract: { email, name, id: _id }


┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Backend Sends Response                              │
└─────────────────────────────────────────────────────────────┘
Status: 200 OK
Body: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "john.doe@example.com",
    "name": "John Doe",
    "id": "507f1f77bcf86cd799439011"
  }
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Frontend Token Storage                              │
└─────────────────────────────────────────────────────────────┘
src/lib/auth.ts → setToken()
│
├─ Store in localStorage:
│  localStorage.setItem('token', 'eyJhbGci...')
│
├─ Token persists even if browser closes
└─ Will be used for all future API requests ✓


┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Redirect to Dashboard                               │
└─────────────────────────────────────────────────────────────┘
├─ Next.js Router: router.push('/dashboard')
└─ User sees their personalized dashboard


✅ LOGIN COMPLETE - User authenticated, token stored
```

---

## 4. DASHBOARD LOADING WORKFLOW

### **When User Visits Dashboard After Login**

```
🎬 USER ACTION: Navigates to /dashboard (or redirected after login)

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Dashboard Page Loads                                │
└─────────────────────────────────────────────────────────────┘
src/app/dashboard/page.tsx
│
├─ React renders component
├─ Show loading spinner initially
└─ useEffect hook triggers on mount


┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Authentication Check                                │
└─────────────────────────────────────────────────────────────┘
useEffect(() => {
  const token = getToken(); // Read from localStorage
  
  if (!token) {
    router.push('/login'); // Redirect if not authenticated
    return;
  }
  
  loadDashboardData(); // Continue if authenticated
}, []);


┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Fetch Dashboard Data (3 Parallel API Calls)         │
└─────────────────────────────────────────────────────────────┘

API Call #1: Fetch Journal Entries
────────────────────────────────────
GET http://localhost:5000/api/journal
Headers: { Authorization: 'Bearer eyJhbGci...' }
│
Backend Processing:
├─ Middleware: auth.js verifies JWT token ✓
├─ Extract userId from decoded token
├─ Query: Journal.find({ userId }).sort({ createdAt: -1 })
├─ MongoDB: Use userId+createdAt compound index
└─ Return: { entries: [5 journal entries] }

API Call #2: Fetch Mood Entries
────────────────────────────────────
GET http://localhost:5000/api/mood
Headers: { Authorization: 'Bearer eyJhbGci...' }
│
Backend Processing:
├─ Middleware: auth.js verifies JWT token ✓
├─ Extract userId from decoded token
├─ Query: Mood.find({ userId }).sort({ createdAt: -1 })
├─ MongoDB: Use userId+createdAt compound index
└─ Return: { entries: [8 mood entries] }

API Call #3: Fetch Chat History
────────────────────────────────────
GET http://localhost:5000/api/chat/history
Headers: { Authorization: 'Bearer eyJhbGci...' }
│
Backend Processing:
├─ Middleware: auth.js verifies JWT token ✓
├─ Extract userId from decoded token
├─ Query: Chat.findOne({ userId }).sort({ updatedAt: -1 })
└─ Return: { messages: [24 chat messages], chatId: "..." }


┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Frontend Processes Data                             │
└─────────────────────────────────────────────────────────────┘
After all 3 API calls complete:
│
├─ Calculate Statistics:
│  ├─ journalEntries count = 5
│  ├─ moodEntries count = 8
│  ├─ chatMessages count = 24
│  ├─ lastMood = first mood entry (most recent)
│  └─ lastMoodScore = moodScore from first entry
│
└─ Update State: setStats({ ... })


┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Dashboard Renders with Data                         │
└─────────────────────────────────────────────────────────────┘
Display Components:
│
├─ Stats Cards (animated slideUp):
│  ├─ 📖 Journal Entries: 5
│  ├─ ❤️ Mood Entries: 8
│  ├─ 💬 Chat Messages: 24
│  └─ 📊 Last Mood: Happy (Score: 5/5)
│
├─ Quick Actions (clickable cards):
│  ├─ Write Journal Entry → /journal
│  ├─ Chat with AI → /chat
│  └─ View Mood Trends → /mood-trends
│
└─ Recent Activity Summary:
   ├─ Show list of recent journals/moods
   └─ "Log Your First Mood" button


┌─────────────────────────────────────────────────────────────┐
│ STEP 6: User Interaction Ready                              │
└─────────────────────────────────────────────────────────────┘
├─ Dashboard fully loaded ✓
├─ All data displayed ✓
└─ User can click any action ✓


✅ DASHBOARD LOADED - User sees their personalized mental health overview
```

---

## 5. JOURNAL ENTRY CREATION WORKFLOW

### **Writing a Journal Entry**

```
🎬 USER ACTION: Clicks "Write New Entry" from dashboard or journal page

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Open Journal Form Modal                             │
└─────────────────────────────────────────────────────────────┘
├─ Modal overlay appears with glassmorphism effect
├─ Form displays:
│  ├─ Mood selector (7 moods with emojis)
│  └─ Textarea for journal content
└─ Submit button disabled (until form valid)


┌─────────────────────────────────────────────────────────────┐
│ STEP 2: User Fills Out Form                                 │
└─────────────────────────────────────────────────────────────┘
A. Select Mood
   ├─ User clicks "Happy" mood button 😊
   ├─ Button highlights with gradient (visual feedback)
   └─ State updated: setFormData({ mood: 'Happy' })

B. Type Journal Content
   User types in textarea:
   "Today was a great day! I finished the project and felt 
    accomplished. Looking forward to the presentation tomorrow."
   
   ├─ Textarea expands as user types
   ├─ Character count updates (if implemented)
   └─ State updated: setFormData({ content: '...' })

C. Form Validation (Real-time)
   ├─ Check mood selected ✓
   ├─ Check content not empty ✓
   └─ Enable submit button ✓


┌─────────────────────────────────────────────────────────────┐
│ STEP 3: User Clicks "Save Entry"                            │
└─────────────────────────────────────────────────────────────┘
├─ Button shows "Saving..." text
├─ Disable button (prevent double-submit)
└─ Trigger handleSubmit(e)


┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Frontend Makes API Request                          │
└─────────────────────────────────────────────────────────────┘
POST http://localhost:5000/api/journal
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGci...'
}
Body: {
  "content": "Today was a great day! I finished...",
  "mood": "Happy",
  "tags": []
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Backend Processing                                  │
└─────────────────────────────────────────────────────────────┘
backend/src/routes/journal.js → POST / handler

A. Authentication
   ├─ Middleware: auth.js verifies JWT token ✓
   └─ Attach userId to req.user.id

B. Validate Input
   ├─ Check content exists ✓
   ├─ Check mood exists ✓
   └─ Validate tags is array (or default to [])

C. Create Journal Document
   const journal = new Journal({
     userId: req.user.id,  // From JWT token
     content: "Today was a great day...",
     mood: "Happy",
     tags: [],
     // MongoDB auto-adds: _id, createdAt
   });

D. Save to Database
   ├─ Call: await journal.save()
   ├─ MongoDB: Insert into 'journals' collection
   ├─ Update indexes: userId+createdAt
   └─ Time: ~10-20ms ✓


┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Backend Returns Created Journal                     │
└─────────────────────────────────────────────────────────────┘
Status: 201 Created
Body: {
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f191e810c19729de860ea",
  "content": "Today was a great day! I finished...",
  "mood": "Happy",
  "tags": [],
  "createdAt": "2024-10-11T15:45:00.000Z"
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Frontend Updates UI                                 │
└─────────────────────────────────────────────────────────────┘
├─ Close modal with scaleOut animation
├─ Clear form data
├─ Reload journal entries: loadEntries()
│  └─ Fetch updated list from API
└─ New entry appears at top of list (slideUp animation)


┌─────────────────────────────────────────────────────────────┐
│ STEP 8: Journal List Display                                │
└─────────────────────────────────────────────────────────────┘
Journal card renders with:
├─ 😊 Happy emoji with mood label
├─ Content: "Today was a great day! I finished..."
├─ Date: "10/11/2024"
├─ Delete button (trash icon)
└─ Hover effect: slight scale up


✅ JOURNAL ENTRY CREATED - Saved to database and displayed in UI
```

---

## 6. MOOD LOGGING WORKFLOW

### **Tracking Daily Mood**

```
🎬 USER ACTION: Clicks "Log Mood" button on dashboard

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Mood Logging Modal Opens                            │
└─────────────────────────────────────────────────────────────┘
Display:
├─ Modal with glassmorphism effect
├─ 7 Mood Buttons (grid layout):
│  ├─ 😊 Happy (score: 5)
│  ├─ 🤩 Excited (score: 5)
│  ├─ 😌 Calm (score: 4)
│  ├─ 😴 Tired (score: 2)
│  ├─ 😢 Sad (score: 1)
│  ├─ 😠 Angry (score: 1)
│  └─ 😰 Anxious (score: 2)
├─ Mood Score Slider (1-5 range)
└─ Description textarea (optional)


┌─────────────────────────────────────────────────────────────┐
│ STEP 2: User Selects Mood & Score                           │
└─────────────────────────────────────────────────────────────┘
A. Click Mood Button
   ├─ User clicks "Calm" 😌
   ├─ Button highlights with gradient
   ├─ Auto-set moodScore to 4 (default for Calm)
   └─ State: setMoodForm({ mood: 'Calm', moodScore: 4 })

B. Adjust Score Slider (Optional)
   ├─ User can override default score
   ├─ Drag slider from 4 → 3
   └─ State: setMoodForm({ ...moodForm, moodScore: 3 })

C. Add Description (Optional)
   User types: "Feeling relaxed after morning meditation"
   └─ State: setMoodForm({ ...moodForm, description: '...' })


┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Submit Mood Entry                                   │
└─────────────────────────────────────────────────────────────┘
User clicks "Save Mood"
│
├─ Validate: mood and moodScore required ✓
├─ Button shows "Saving..."
└─ Make API request


┌─────────────────────────────────────────────────────────────┐
│ STEP 4: API Request to Backend                              │
└─────────────────────────────────────────────────────────────┘
POST http://localhost:5000/api/mood
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGci...'
}
Body: {
  "mood": "Calm",
  "moodScore": 3,
  "description": "Feeling relaxed after morning meditation"
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Backend Processing                                  │
└─────────────────────────────────────────────────────────────┘
backend/src/routes/mood.js → POST / handler

A. Authentication & Authorization
   ├─ Middleware verifies JWT ✓
   └─ Extract userId

B. Validate Input
   ├─ Check mood exists ✓
   ├─ Check moodScore between 1-5 ✓
   └─ Description optional (default to empty string)

C. Create Mood Document
   const moodEntry = new Mood({
     userId: req.user.id,
     mood: "Calm",
     moodScore: 3,
     description: "Feeling relaxed after morning meditation",
     // MongoDB auto-adds: _id, createdAt
   });

D. Save to Database
   ├─ await moodEntry.save()
   ├─ MongoDB inserts into 'moods' collection
   └─ Update userId+createdAt index


┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Backend Returns Created Mood                        │
└─────────────────────────────────────────────────────────────┘
Status: 201 Created
Body: {
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f191e810c19729de860ea",
  "mood": "Calm",
  "moodScore": 3,
  "description": "Feeling relaxed after morning meditation",
  "createdAt": "2024-10-11T16:00:00.000Z"
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Frontend Updates UI                                 │
└─────────────────────────────────────────────────────────────┘
├─ Close modal
├─ Clear form
├─ Reload dashboard data: loadDashboardData()
└─ Updated stats:
   ├─ Mood Entries: 8 → 9 ✓
   ├─ Last Mood: "Calm" ✓
   └─ Last Mood Score: 3/5 ✓


┌─────────────────────────────────────────────────────────────┐
│ STEP 8: Mood Available for Analytics                        │
└─────────────────────────────────────────────────────────────┘
This mood entry now:
├─ Appears in Mood Trends chart
├─ Affects 7-day and 30-day averages
├─ Contributes to mood streak calculation
└─ Shows in mood history table


✅ MOOD LOGGED - Data saved and contributes to mental health analytics
```

---

## 7. AI CHATBOT CONVERSATION WORKFLOW

### **Getting Support from AI Assistant**

```
🎬 USER ACTION: Navigates to /chat page, types message

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Chat Page Loads                                     │
└─────────────────────────────────────────────────────────────┘
src/app/chat/page.tsx
│
├─ Check authentication (token exists)
├─ Load chat history from backend
└─ Render Chatbot component with token prop


┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Load Previous Chat History                          │
└─────────────────────────────────────────────────────────────┘
useEffect(() => {
  loadChatHistory();
}, []);

GET http://localhost:5000/api/chat/history
Headers: { Authorization: 'Bearer eyJhbGci...' }
│
Backend:
├─ Verify JWT token ✓
├─ Query: Chat.findOne({ userId }).sort({ updatedAt: -1 })
└─ Return previous messages (if any)

Frontend:
├─ Receive message history
├─ Format messages with roles and timestamps
└─ Display in chat bubbles (scrolled to bottom)


┌─────────────────────────────────────────────────────────────┐
│ STEP 3: User Types Message                                  │
└─────────────────────────────────────────────────────────────┘
User types in input field:
"I've been feeling overwhelmed with work lately"
│
├─ Input field controlled by React state
└─ Send button enabled when text exists


┌─────────────────────────────────────────────────────────────┐
│ STEP 4: User Clicks Send Button                             │
└─────────────────────────────────────────────────────────────┘
├─ Optimistic UI Update:
│  └─ Immediately add user message to chat (blue bubble)
│
├─ Disable input and button
├─ Show loading spinner
└─ Trigger API request


┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Frontend to Next.js API Route (Proxy Layer)         │
└─────────────────────────────────────────────────────────────┘
POST /api/chat (Next.js API route)
Headers: { Authorization: 'Bearer eyJhbGci...' }
Body: {
  "message": "I've been feeling overwhelmed with work lately",
  "useFallback": false
}

Why proxy through Next.js?
├─ Hide backend URL from client
├─ Add additional middleware if needed
└─ Better error handling and logging


┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Next.js Forwards to Express Backend                 │
└─────────────────────────────────────────────────────────────┘
POST http://localhost:5000/api/chat
Headers: { Authorization: 'Bearer eyJhbGci...' }
Body: { message: "I've been feeling...", useFallback: false }


┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Backend Chat Route Processing                       │
└─────────────────────────────────────────────────────────────┘
backend/src/routes/chat.js → POST / handler

A. Authentication
   ├─ Middleware verifies JWT ✓
   └─ Extract userId

B. Retrieve Chat History
   ├─ Query: Chat.findOne({ userId }).sort({ updatedAt: -1 })
   ├─ If no chat exists → Create new Chat document
   └─ Get existing chat ✓

C. Add User Message to History
   chat.messages.push({
     role: 'user',
     content: "I've been feeling overwhelmed with work lately",
     timestamp: new Date()
   });

D. Prepare Context for AI (Last 10 Messages)
   const recentMessages = chat.messages.slice(-10);
   
   const messages = [
     { 
       role: 'system', 
       content: "You are an empathetic, supportive AI assistant..." 
     },
     ...recentMessages.map(msg => ({
       role: msg.role,
       content: msg.content
     }))
   ];

E. Construct Prompt for Ollama
   const prompt = 
     "System: You are an empathetic, supportive AI assistant...\n" +
     "User: Hello\n" +
     "Assistant: Hello! How are you feeling today?\n" +
     "User: I've been feeling overwhelmed with work lately\n" +
     "Assistant: ";


┌─────────────────────────────────────────────────────────────┐
│ STEP 8: Call Ollama API (AI Processing)                     │
└─────────────────────────────────────────────────────────────┘
POST http://localhost:11434/api/generate
Headers: { Content-Type: 'application/json' }
Body: {
  "model": "llama3.2",
  "prompt": "[full conversation prompt]",
  "stream": false,
  "options": {
    "temperature": 0.7,  // Creativity level
    "top_p": 0.9,        // Sampling threshold
    "num_predict": 400   // Max response length
  }
}

Ollama Server Processing:
├─ Load Llama 3.2 model weights (~2.5GB)
├─ Tokenize input prompt
├─ Run transformer model inference
├─ Generate response token by token
├─ Detokenize output
└─ Return JSON response

Processing Time: 
├─ With GPU: 3-8 seconds
└─ With CPU: 15-30 seconds

Ollama Response:
{
  "response": "I hear you're feeling overwhelmed with work. That's 
               a really common feeling, especially when there's a 
               lot on your plate. Let's take a moment to breathe 
               together - try inhaling for 4 counts, holding for 4, 
               and exhaling for 4. Would you like to talk about 
               what specifically is overwhelming you right now?"
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 9: Backend Saves AI Response                           │
└─────────────────────────────────────────────────────────────┘
chat.messages.push({
  role: 'assistant',
  content: "I hear you're feeling overwhelmed...",
  timestamp: new Date()
});

await chat.save();
└─ MongoDB updates chat document with both messages


┌─────────────────────────────────────────────────────────────┐
│ STEP 10: Backend Returns Response to Frontend               │
└─────────────────────────────────────────────────────────────┘
Status: 200 OK
Body: {
  "response": "I hear you're feeling overwhelmed...",
  "chatId": "507f1f77bcf86cd799439014",
  "messageCount": 12
}


┌─────────────────────────────────────────────────────────────┐
│ STEP 11: Frontend Displays AI Response                      │
└─────────────────────────────────────────────────────────────┘
├─ Receive response from API ✓
├─ Create message object:
│  {
│    id: Date.now(),
│    role: 'assistant',
│    content: "I hear you're feeling overwhelmed...",
│    timestamp: new Date()
│  }
├─ Add to chatHistory state
├─ Render in white chat bubble (left side) with Bot icon
├─ Apply React Markdown formatting (bold, lists, etc.)
├─ Auto-scroll to bottom (smooth animation)
└─ Re-enable input field and button


┌─────────────────────────────────────────────────────────────┐
│ STEP 12: User Can Continue Conversation                     │
└─────────────────────────────────────────────────────────────┘
└─ Chat now has context of previous messages for next response


✅ AI CONVERSATION COMPLETE - User received empathetic, context-aware support

┌─────────────────────────────────────────────────────────────┐
│ FALLBACK MECHANISM (If Ollama Fails)                        │
└─────────────────────────────────────────────────────────────┘
If Ollama timeout or error:
├─ Catch error in try-catch block
├─ Call getFallbackResponse(message)
├─ Keyword matching:
│  ├─ "overwhelmed" → breathing exercises
│  ├─ "anxious" → grounding techniques
│  ├─ "sad" → validation + support
│  └─ default → "I'm here to listen..."
└─ Return fallback response immediately (no delay)

User can also toggle "Fallback Mode" for instant responses
```

---

## 8. MOOD TRENDS & ANALYTICS WORKFLOW

### **Visualizing Mental Health Patterns**

```
🎬 USER ACTION: Clicks "View Mood Trends" from dashboard

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Navigate to Mood Trends Page                        │
└─────────────────────────────────────────────────────────────┘
src/app/mood-trends/page.tsx
│
├─ Check authentication
├─ Show loading spinner
└─ Fetch mood data


┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Fetch All Mood Entries                              │
└─────────────────────────────────────────────────────────────┘
GET http://localhost:5000/api/mood
Headers: { Authorization: 'Bearer eyJhbGci...' }

Backend:
├─ Verify JWT ✓
├─ Query: Mood.find({ userId }).sort({ createdAt: -1 })
├─ Return all mood entries (no limit)
└─ Example: 50 mood entries from past 3 months


┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Frontend Calculates Analytics                       │
└─────────────────────────────────────────────────────────────┘

A. Filter Entries by Time Period
   ├─ Last 7 days: 
   │  └─ Filter entries where createdAt >= (now - 7 days)
   │  └─ Result: 7 entries
   │
   └─ Last 30 days:
      └─ Filter entries where createdAt >= (now - 30 days)
      └─ Result: 28 entries

B. Calculate Average Mood Scores
   ├─ 7-day average:
   │  └─ Sum all moodScores / count
   │  └─ (5 + 4 + 3 + 4 + 5 + 3 + 4) / 7 = 4.0
   │
   └─ 30-day average:
      └─ Sum all scores / 28
      └─ Result: 3.75

C. Find Best and Worst Days
   ├─ Best day:
   │  └─ Find entry with max(moodScore)
   │  └─ { mood: "Excited", score: 5, date: "10/05/2024" }
   │
   └─ Worst day:
      └─ Find entry with min(moodScore)
      └─ { mood: "Sad", score: 1, date: "09/28/2024" }

D. Calculate Mood Logging Streak
   ├─ Sort entries by date (newest first)
   ├─ Check consecutive days with entries
   ├─ Example:
   │  10/11 ✓ → 10/10 ✓ → 10/09 ✓ → 10/08 X (gap)
   └─ Streak: 3 days


┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Display Analytics Cards                             │
└─────────────────────────────────────────────────────────────┘
Render 5 cards with animated entrance:

Card 1: 7-Day Average
├─ Icon: 🎯 Target
├─ Value: 4.0 / 5
└─ Color: Blue gradient

Card 2: 30-Day Average
├─ Icon: 📊 Activity
├─ Value: 3.75 / 5
└─ Color: Purple gradient

Card 3: Best Day
├─ Icon: 🏆 Award
├─ Mood: Excited 🤩
├─ Score: 5 / 5
├─ Date: Oct 5, 2024
└─ Color: Green gradient

Card 4: Worst Day
├─ Icon: 📅 Calendar
├─ Mood: Sad 😢
├─ Score: 1 / 5
├─ Date: Sep 28, 2024
└─ Color: Red gradient

Card 5: Logging Streak
├─ Icon: ✨ Sparkles
├─ Value: 3 days
├─ Message: "Keep up the great work!"
└─ Color: Orange gradient


┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Render Mood Trends Chart (Recharts)                 │
└─────────────────────────────────────────────────────────────┘
src/components/MoodTrendsChart.tsx

A. Prepare Chart Data
   Transform mood entries into chart format:
   [
     { date: "10/05", score: 5 },
     { date: "10/06", score: 4 },
     { date: "10/07", score: 3 },
     { date: "10/08", score: 4 },
     { date: "10/09", score: 5 },
     { date: "10/10", score: 3 },
     { date: "10/11", score: 4 }
   ]

B. Render Line Chart
   ├─ X-axis: Dates (formatted MM/DD)
   ├─ Y-axis: Mood Score (1-5 scale)
   ├─ Line: Blue gradient stroke
   ├─ Points: Circular dots on each data point
   ├─ Grid: Subtle background lines
   ├─ Tooltip: Shows exact score and mood on hover
   └─ Responsive: Adjusts to container width

C. Chart Interactions
   ├─ Hover over point → Show tooltip with details
   ├─ Tooltip content: "Happy - Score: 5/5 - Oct 11, 2024"
   └─ Smooth animations on load and updates


┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Display Mood History Table                          │
└─────────────────────────────────────────────────────────────┘
Render table with all mood entries:

Headers: Date | Mood | Score | Description | Actions

Row Example:
├─ Date: 10/11/2024
├─ Mood: 😌 Calm
├─ Score: 3 / 5
├─ Description: "Feeling relaxed after morning meditation"
└─ Actions: [Delete Button]

Table Features:
├─ Sortable columns (click header to sort)
├─ Hover effect on rows (highlight)
├─ Delete button per entry
├─ Responsive (horizontal scroll on mobile)
└─ Shows empty state if no entries


┌─────────────────────────────────────────────────────────────┐
│ STEP 7: User Interacts with Delete Button                   │
└─────────────────────────────────────────────────────────────┘
User clicks delete on a mood entry:
│
├─ Show confirmation dialog:
│  "Are you sure you want to delete this mood entry? 
│   This action cannot be undone."
│
├─ If confirmed:
│  ├─ DELETE http://localhost:5000/api/mood/507f1f77bcf86cd799439013
│  ├─ Backend: Delete from MongoDB
│  ├─ Frontend: Remove from UI (fade out animation)
│  └─ Recalculate analytics
│
└─ If cancelled: Close dialog, no action


✅ MOOD TRENDS COMPLETE - User sees comprehensive mental health analytics
```

---

## 9. COMPLETE USER JOURNEY (Day in the Life)

### **Full Daily Workflow from Start to Finish**

```
📅 MORNING (8:00 AM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User wakes up, opens browser:
│
├─ Goes to: https://lovely-strudel-e54e92.netlify.app
├─ Already logged in (token in localStorage) ✓
└─ Automatically redirected to /dashboard

Dashboard loads showing:
├─ 12 journal entries
├─ 25 mood entries
├─ 48 chat messages
└─ Last mood: "Calm" (Score: 4/5) from yesterday

User clicks "Log Mood" button:
├─ Modal opens with mood selector
├─ Selects: 😊 Happy (Score: 5)
├─ Description: "Woke up well-rested and ready for the day"
├─ Clicks "Save Mood"
└─ ✓ Mood logged successfully

Dashboard updates:
└─ Mood Entries: 25 → 26
└─ Last Mood: "Happy" (Score: 5/5) 🎉


📝 AFTERNOON (2:00 PM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User clicks "Write Journal Entry":
│
├─ Modal opens with journal form
├─ Selects mood: 😌 Calm
├─ Writes content:
│  "Had a productive morning meeting. The team responded well
│   to my presentation. Feeling confident about the project
│   direction. Taking a walk during lunch helped clear my mind."
├─ Clicks "Save Entry"
└─ ✓ Journal saved successfully

Journal list updates:
└─ New entry appears at top (slideUp animation)
└─ Journal Entries: 12 → 13


💬 EVENING (7:00 PM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User feeling anxious about tomorrow:
│
├─ Clicks "Chat with AI" from dashboard
├─ Chat page loads with previous conversation history
└─ Types message: "I'm feeling nervous about tomorrow's deadline"

AI Chatbot responds (15 seconds later):
"I understand that deadlines can create anxiety. Let's work 
 through this together. First, take a deep breath with me - 
 inhale for 4, hold for 4, exhale for 4. 

 Can you tell me what specific aspects of the deadline are 
 making you nervous? Sometimes breaking it down helps."

User continues conversation:
├─ User: "I'm worried I won't finish everything in time"
│
├─ AI: "That's a valid concern. Let's approach this practically:
│      1. What tasks are absolutely essential for tomorrow?
│      2. What can be completed next week if needed?
│      3. Do you have everything you need to finish the essentials?
│      
│      Often we put more pressure on ourselves than necessary.
│      Would it help to make a priority list together?"
│
├─ User: "Yes, that would help. Thank you."
│
└─ AI: "I'm glad I could help! Remember, you've handled deadlines
       before and you'll get through this one too. You're more
       capable than you think. Come back anytime you need support."

User feels better:
└─ ✓ Chat messages saved to history


📊 BEFORE BED (10:00 PM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User checks "Mood Trends" page:
│
├─ Sees analytics:
│  ├─ 7-day average: 4.2 / 5 (improvement from last week!)
│  ├─ 30-day average: 3.8 / 5
│  ├─ Best day: Happy (5/5) - Today! 🎉
│  ├─ Worst day: Sad (2/5) - 3 days ago
│  └─ Mood streak: 14 days (2 weeks!)
│
├─ Views mood trend chart:
│  └─ Notices upward trend over past 2 weeks
│
└─ Feels encouraged by visual progress

User logs end-of-day mood:
├─ Mood: 😌 Calm (Score: 4)
└─ Description: "Feeling better after talking with AI and 
                 making a plan. Ready for tomorrow."


🌙 END OF DAY SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Today's Activity:
├─ 2 moods logged (Happy, Calm)
├─ 1 journal entry written
├─ 6 AI chat messages exchanged
└─ Viewed mood trends and gained insights

Database Updates:
├─ 2 new mood documents in MongoDB
├─ 1 new journal document in MongoDB
├─ Chat document updated with 6 messages
└─ User's mental health data growing

User's Mental Health Journey:
├─ Started day feeling happy
├─ Stayed productive and calm
├─ Experienced anxiety but got support
├─ Ended day feeling prepared and calm
└─ Sees long-term improvement in trends


✅ COMPLETE DAY TRACKED - User has comprehensive mental health record
```

---

## 10. BEHIND THE SCENES: TECHNICAL WORKFLOW

### **What Happens in the System Layer**

```
┌─────────────────────────────────────────────────────────────┐
│           CONTINUOUS BACKGROUND PROCESSES                    │
└─────────────────────────────────────────────────────────────┘

MongoDB Atlas (Always Running):
├─ Connection pool: 5 active connections maintained
├─ Automatic backups: Daily snapshots
├─ Index maintenance: B-tree structures updated on writes
├─ Query optimization: Uses indexes for fast lookups
└─ Connection encryption: TLS/SSL for all connections

Ollama Server (Running locally or on server):
├─ Model loaded in memory: Llama 3.2 (~2.5GB RAM/VRAM)
├─ Listening on: http://localhost:11434
├─ Ready to process: Inference requests
└─ Context window: 2048 tokens

Express Backend (Running on Render):
├─ Process ID: Node.js process running server.js
├─ Port: 5000 (or assigned by Render)
├─ MongoDB connection: Established and pooled
├─ Middleware stack: CORS → JSON parser → Auth → Routes
└─ Health check: Responds to /api/health every 5 minutes

Next.js Frontend (Deployed on Netlify):
├─ Static files: Served via global CDN
├─ SSR: Server-side renders pages on request
├─ Client hydration: React makes pages interactive
└─ API proxy: /api/chat routes through Next.js Edge


┌─────────────────────────────────────────────────────────────┐
│           REQUEST/RESPONSE LIFECYCLE                         │
└─────────────────────────────────────────────────────────────┘

Every API Request Goes Through:

1. Client Initiates Request
   ├─ Browser: fetch() call with Authorization header
   └─ Network: HTTP request over internet

2. Server Receives Request
   ├─ Express: Incoming HTTP request
   └─ req object: Contains method, path, headers, body

3. Middleware Chain Execution
   ├─ CORS Middleware:
   │  └─ Check origin is allowed
   │  └─ Add CORS headers to response
   │
   ├─ Body Parser Middleware:
   │  └─ Parse JSON body into req.body
   │
   ├─ Auth Middleware (for protected routes):
   │  └─ Extract JWT from header
   │  └─ Verify signature with JWT_SECRET
   │  └─ Decode payload: { userId: "..." }
   │  └─ Attach to req.user
   │
   └─ Route Handler:
      └─ Execute specific route logic

4. Database Operation (if needed)
   ├─ Mongoose query: User.find({ userId })
   ├─ MongoDB: Execute query using index
   ├─ Network round-trip: ~5-20ms (Atlas cloud)
   └─ Return: Array of documents

5. Business Logic Processing
   ├─ Validate data
   ├─ Transform data
   ├─ Calculate values
   └─ Prepare response

6. Send Response
   ├─ Set status code: 200, 201, 400, 401, 500
   ├─ Set headers: Content-Type, etc.
   ├─ Serialize body to JSON
   └─ Send to client

7. Client Receives Response
   ├─ Parse JSON response
   ├─ Update React state
   ├─ Re-render components
   └─ Show updated UI to user

Average Total Time:
├─ Auth request (login): 150ms
├─ Database read: 50-80ms
├─ Database write: 80-120ms
└─ AI chat request: 5-30 seconds


┌─────────────────────────────────────────────────────────────┐
│           STATE MANAGEMENT FLOW                              │
└─────────────────────────────────────────────────────────────┘

Frontend State Layers:

1. Browser Storage Layer
   ├─ localStorage.token → JWT token (persistent)
   ├─ localStorage.darkMode → Theme preference
   └─ Survives browser restarts

2. React Component State Layer
   ├─ Dashboard: stats, loading, error states
   ├─ Chat: messages, input, isLoading
   ├─ Journal: entries, showForm, formData
   └─ Mood Trends: moods, analytics, chartData

3. URL State Layer
   ├─ Current route: /dashboard, /chat, etc.
   ├─ Query parameters: ?start=2024-10-01&end=2024-10-11
   └─ Managed by Next.js router

State Update Cycle:
   User Action 
      → State Change (useState)
      → React Re-render
      → DOM Update
      → Visual Change

Backend State:
   ├─ Request-scoped: req, res objects (per request)
   ├─ Application-scoped: Express app, MongoDB connection
   └─ Stateless: No session storage (JWT handles auth)


┌─────────────────────────────────────────────────────────────┐
│           SECURITY WORKFLOW (Every Request)                  │
└─────────────────────────────────────────────────────────────┘

For Protected Routes:

1. Client Preparation
   ├─ Retrieve token from localStorage
   ├─ Add to Authorization header: "Bearer eyJhbGci..."
   └─ Send request

2. Server Reception
   └─ Request arrives with Authorization header

3. JWT Middleware Verification
   ├─ Extract header: req.header('Authorization')
   ├─ Check format: Starts with "Bearer "
   ├─ Extract token: Split and get second part
   ├─ Verify signature:
   │  └─ jwt.verify(token, JWT_SECRET)
   │  └─ Checks HMAC-SHA256 signature
   │  └─ Verifies not expired (7 days)
   ├─ Decode payload:
   │  └─ { userId: "507f191e810c19729de860ea", iat: ..., exp: ... }
   └─ Attach to request:
      └─ req.user = { id: decoded.userId }

4. Authorization Success
   └─ Continue to route handler with verified user ID

5. Authorization Failure
   ├─ Token missing → 401 "No token provided"
   ├─ Token expired → 401 "Token expired"
   ├─ Token invalid → 401 "Invalid token"
   └─ Stop request, return error

6. Route Handler
   ├─ Use req.user.id to query user-specific data
   ├─ Example: Journal.find({ userId: req.user.id })
   └─ User can only access their own data (security ✓)


┌─────────────────────────────────────────────────────────────┐
│           ERROR HANDLING WORKFLOW                            │
└─────────────────────────────────────────────────────────────┘

When Something Goes Wrong:

Backend Error Handling:
├─ Try-Catch Blocks:
│  try {
│    // Database operation
│    await user.save();
│  } catch (err) {
│    console.error('Save failed:', err);
│    return res.status(500).json({ error: 'Failed to save' });
│  }
│
├─ Global Error Handler:
│  app.use((err, req, res, next) => {
│    console.error(err.stack);
│    res.status(500).json({ error: 'Something went wrong!' });
│  });
│
└─ Specific Error Responses:
   ├─ 400: Bad Request (invalid input)
   ├─ 401: Unauthorized (auth failed)
   ├─ 404: Not Found (resource doesn't exist)
   └─ 500: Server Error (unexpected error)

Frontend Error Handling:
├─ Try-Catch for API calls:
│  try {
│    const response = await fetch(url);
│    if (!response.ok) throw new Error('API failed');
│  } catch (error) {
│    setError('Failed to load data');
│    console.error(error);
│  }
│
├─ Error States:
│  ├─ Loading: Show spinner
│  ├─ Error: Show error message
│  └─ Success: Show data
│
└─ User-Friendly Messages:
   ├─ Don't show technical errors to user
   ├─ "Something went wrong. Please try again."
   └─ "Failed to connect. Check your internet."

AI Chatbot Error Handling:
├─ Ollama Timeout:
│  └─ After 5 minutes → Use fallback response
├─ Ollama Unavailable:
│  └─ Catch error → Use fallback response
└─ Fallback Always Works:
   └─ Rule-based responses (no external dependency)
```

---

## 🎤 HOW TO EXPLAIN THIS IN AN INTERVIEW

### **Elevator Pitch (30 seconds)**
"The application has three main user workflows: registration/login with JWT authentication, daily mental health tracking through journaling and mood logging, and real-time AI support through a chatbot. Behind the scenes, the system uses Next.js for the frontend, Express for the REST API, MongoDB for data storage, and Ollama with Llama 3.2 for AI responses. Every request goes through JWT verification for security, and all user data is properly isolated using their unique user ID."

### **Technical Deep Dive (5 minutes)**
1. **Start with authentication**: "When a user logs in, their password is compared with the bcrypt hash in MongoDB. If valid, I generate a JWT token with their user ID, which they store in localStorage and send with every subsequent request."

2. **Explain a feature workflow**: "For the AI chatbot, when they send a message, it goes through a Next.js API proxy to my Express backend. The backend retrieves their last 10 messages from MongoDB to maintain context, constructs a prompt with a system message for empathy, calls the Ollama API running Llama 3.2, waits for the response—which can take 5-30 seconds—and then saves both the user message and AI response back to MongoDB before returning to the frontend."

3. **Show data flow**: "The mood tracking workflow is simpler: user selects a mood and score, frontend validates it, backend creates a Mood document with their user ID from the JWT token, saves to MongoDB with a compound index on userId and createdAt for fast queries, and returns the created mood. The frontend then reloads the dashboard which recalculates analytics like 7-day averages and mood streaks."

4. **Highlight security**: "Every protected route goes through my auth middleware that verifies the JWT signature, checks expiration, and attaches the user ID to the request. This ensures users can only access their own data—when they query for journals, I always filter by their user ID from the token."

### **For Behavioral Questions**
"One interesting challenge was handling Ollama's variable response times. Sometimes responses took 30 seconds, causing user frustration. I implemented a multi-layered solution: extended timeouts to 5 minutes with AbortController, added clear loading states, created a fallback mode with rule-based responses, and gave users a toggle to choose between AI and instant fallback responses. This ensured a reliable user experience regardless of AI availability."

---

**You're now fully prepared to explain your project workflow at any level of detail! 🚀**

This workflow document covers everything from high-level user journeys to low-level technical processes. Practice walking through these workflows, and you'll confidently answer any "how does it work?" question in your interview!


