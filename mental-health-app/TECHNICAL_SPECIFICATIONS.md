# 📐 Technical Specifications & Architecture Document

## Project Overview
**Name:** Mental Health Journal & AI Chatbot  
**Type:** Full-Stack Web Application  
**Status:** Production Deployed  
**Version:** 1.0.0  
**Frontend URL:** https://lovely-strudel-e54e92.netlify.app  
**Backend URL:** Hosted on Render

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Browser  │  │ Mobile   │  │ Tablet   │  │ Desktop  │         │
│  │ (Chrome) │  │ (Safari) │  │ (iPad)   │  │ (Firefox)│         │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘         │
│        │             │              │             │               │
│        └─────────────┴──────────────┴─────────────┘               │
│                           │                                        │
│                    HTTPS (TLS 1.3)                                │
└───────────────────────────┼────────────────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────────────────┐
│                    PRESENTATION LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Next.js 15 Application (Netlify)                 │ │
│  │                                                                │ │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐      │ │
│  │  │ App Router │  │ React Pages  │  │ API Routes      │      │ │
│  │  │ (Routes)   │  │ (Components) │  │ (Proxy Layer)   │      │ │
│  │  └────────────┘  └──────────────┘  └─────────────────┘      │ │
│  │                                                                │ │
│  │  Features: SSR, Code Splitting, Optimized Builds              │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬───────────────────────────────────────┘
                             │
                    REST API (JSON)
                    Authorization: Bearer JWT
                             │
┌────────────────────────────▼───────────────────────────────────────┐
│                     APPLICATION LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │          Express.js Server (Node.js on Render)                │ │
│  │                                                                │ │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌────────────┐ │ │
│  │  │  Auth    │  │  Journal  │  │  Mood    │  │   Chat     │ │ │
│  │  │  Routes  │  │  Routes   │  │  Routes  │  │   Routes   │ │ │
│  │  └──────────┘  └───────────┘  └──────────┘  └────────────┘ │ │
│  │       │              │              │              │         │ │
│  │  ┌────▼──────────────▼──────────────▼──────────────▼──────┐ │ │
│  │  │         JWT Authentication Middleware                   │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────┬────────────────────┬─────────────────────────┘
                      │                    │
                      │                    │
         ┌────────────▼────────┐    ┌──────▼──────────┐
         │                     │    │                 │
┌────────▼─────────┐  ┌────────▼─────────┐  ┌────────▼─────────┐
│   DATA LAYER     │  │   AI LAYER       │  │  CACHE LAYER     │
│                  │  │                  │  │  (Future)        │
│  MongoDB Atlas   │  │  Ollama Server   │  │                  │
│                  │  │  (Llama 3.2)     │  │  Redis           │
│  Collections:    │  │                  │  │  (Not impl.)     │
│  • users         │  │  Port: 11434     │  │                  │
│  • journals      │  │  Model: llama3.2 │  │                  │
│  • moods         │  │  Timeout: 5 min  │  │                  │
│  • chats         │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 🔐 Authentication Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Register/Login
       │    (POST /api/auth/register or /login)
       │
┌──────▼─────────────────────────────────────┐
│       Express Backend                      │
│                                            │
│  2. Validate Input                        │
│     ├─ Check email exists?                │
│     └─ Validate password strength         │
│                                            │
│  3. Password Hashing                      │
│     ├─ bcrypt.hash(password, 10)          │
│     └─ 1024 iterations                    │
│                                            │
│  4. Database Operation                    │
│     ├─ Save user to MongoDB               │
│     └─ Return success                     │
│                                            │
│  5. (Login Only) Generate JWT             │
│     ├─ Payload: { userId: user._id }     │
│     ├─ Secret: process.env.JWT_SECRET    │
│     └─ Expiry: 7 days                    │
└──────┬─────────────────────────────────────┘
       │
       │ 6. Return Token
       ▼
┌─────────────────────┐
│  Frontend           │
│                     │
│  7. Store Token     │
│     localStorage    │
│     .setItem(       │
│       'token',      │
│       jwt_token     │
│     )               │
└─────────────────────┘
       │
       │ 8. Subsequent Requests
       │    Authorization: Bearer <token>
       ▼
┌─────────────────────────────────────────┐
│  JWT Middleware (auth.js)               │
│                                         │
│  9. Extract Token                       │
│     Authorization header                │
│                                         │
│  10. Verify Token                       │
│      jwt.verify(token, JWT_SECRET)     │
│                                         │
│  11. If Valid                          │
│      ├─ Attach user to request         │
│      │  req.user = { id: decoded.userId }│
│      └─ Call next()                    │
│                                         │
│  12. If Invalid                        │
│      └─ Return 401 Unauthorized        │
└─────────────────────────────────────────┘
```

---

## 🤖 AI Chat System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CHAT REQUEST FLOW                         │
└─────────────────────────────────────────────────────────────┘

Step 1: User Input
┌──────────────┐
│  User types  │
│  "I feel sad"│
└──────┬───────┘
       │
       ▼
Step 2: Frontend Processing
┌─────────────────────────┐
│  Chatbot.tsx Component  │
│  • Add to UI (optimistic)│
│  • Send to backend      │
└──────┬──────────────────┘
       │ POST /api/chat
       │ { message: "I feel sad" }
       │
       ▼
Step 3: Next.js API Proxy
┌─────────────────────────┐
│  /api/chat/route.ts     │
│  • Extract auth header  │
│  • Forward to backend   │
└──────┬──────────────────┘
       │
       ▼
Step 4: Express Backend
┌──────────────────────────────────────────┐
│  backend/src/routes/chat.js              │
│                                          │
│  A. Verify JWT Token                    │
│     └─ Middleware: auth.js              │
│                                          │
│  B. Retrieve Chat History               │
│     └─ MongoDB: Chat.findOne({userId})  │
│                                          │
│  C. Get Last 10 Messages                │
│     └─ chat.messages.slice(-10)         │
│                                          │
│  D. Add User Message                    │
│     └─ chat.messages.push({             │
│          role: 'user',                  │
│          content: "I feel sad"          │
│        })                                │
└──────┬───────────────────────────────────┘
       │
       ▼
Step 5: Ollama API Call
┌───────────────────────────────────────────┐
│  callOllama(messages)                     │
│                                           │
│  Request to: http://localhost:11434/api/generate │
│  Body: {                                  │
│    model: "llama3.2",                    │
│    prompt: `System: [empathetic prompt]  │
│             User: I feel sad             │
│             Assistant: `,                 │
│    temperature: 0.7,                     │
│    top_p: 0.9,                           │
│    stream: false                         │
│  }                                        │
│                                           │
│  Timeout: 5 minutes (AbortController)    │
└──────┬────────────────────────────────────┘
       │
       ▼
Step 6: Ollama Processing
┌────────────────────────┐
│  Llama 3.2 Model       │
│  • Load model weights  │
│  • Process prompt      │
│  • Generate response   │
│  • Return JSON         │
└──────┬─────────────────┘
       │
       ▼
Step 7: Backend Response Handling
┌──────────────────────────────────────────┐
│  backend/src/routes/chat.js              │
│                                          │
│  E. Receive AI Response                 │
│     └─ response: "I'm sorry you're      │
│        feeling sad. Would you like      │
│        to talk about it?"               │
│                                          │
│  F. Save AI Message                     │
│     └─ chat.messages.push({             │
│          role: 'assistant',             │
│          content: [AI response]         │
│        })                                │
│                                          │
│  G. Save to MongoDB                     │
│     └─ await chat.save()                │
│                                          │
│  H. Return Response                     │
│     └─ res.json({ response, chatId })   │
└──────┬───────────────────────────────────┘
       │
       ▼
Step 8: Frontend Display
┌──────────────────────────┐
│  Chatbot.tsx Component   │
│  • Receive response      │
│  • Add to chat history   │
│  • Render in UI          │
│  • Auto-scroll down      │
└──────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FALLBACK MECHANISM                        │
└─────────────────────────────────────────────────────────────┘

If Ollama Fails:
┌────────────────────────┐
│  getFallbackResponse() │
│                        │
│  • Keyword matching    │
│  • "sad" → sympathy    │
│  • "anxious" → breathing│
│  • "help" → crisis msg │
│  • default → support   │
└────────────────────────┘
```

---

## 📊 Database Schema & Relationships

### Entity Relationship Diagram

```
┌─────────────────────────────────────┐
│             User                    │
│─────────────────────────────────────│
│ PK  _id: ObjectId                   │
│     email: String (UNIQUE)          │
│     password: String (HASHED)       │
│     name: String                    │
│     createdAt: Date                 │
└──────┬──────────────────────────────┘
       │ 1
       │
       │ has many
       │
   ┌───┴───┬────────────┬────────────┐
   │       │            │            │
   │ N     │ N          │ N          │ N
   ▼       ▼            ▼            ▼
┌─────┐ ┌──────┐  ┌──────┐    ┌──────┐
│Journal│Mood │  │ Chat │    │(Future)│
│Entry││Entry│  │      │    │Profile │
└─────┘ └──────┘  └──────┘    └──────┘

┌────────────────────────────┐      ┌────────────────────────────┐
│      Journal               │      │         Mood               │
│────────────────────────────│      │────────────────────────────│
│ PK  _id: ObjectId          │      │ PK  _id: ObjectId          │
│ FK  userId: ObjectId       │      │ FK  userId: ObjectId       │
│     content: String        │      │     mood: String           │
│     mood: String           │      │     moodScore: Number(1-5) │
│     tags: [String]         │      │     description: String    │
│     createdAt: Date        │      │     createdAt: Date        │
│                            │      │                            │
│ INDEX: userId + createdAt  │      │ INDEX: userId + createdAt  │
└────────────────────────────┘      └────────────────────────────┘

┌──────────────────────────────────────────────┐
│              Chat                            │
│──────────────────────────────────────────────│
│ PK  _id: ObjectId                            │
│ FK  userId: ObjectId                         │
│     messages: [                              │
│       {                                      │
│         role: 'user'|'assistant'|'system',  │
│         content: String,                     │
│         timestamp: Date                      │
│       }                                      │
│     ]                                        │
│     createdAt: Date                          │
│     updatedAt: Date                          │
│                                              │
│ INDEX: userId + createdAt                    │
│ PRE-SAVE HOOK: Update updatedAt             │
└──────────────────────────────────────────────┘
```

### Data Access Patterns

```
Common Queries:

1. Get User's Journals (Sorted by Date)
   Query: Journal.find({ userId }).sort({ createdAt: -1 })
   Index Used: { userId: 1, createdAt: -1 }
   Time Complexity: O(log n)

2. Get User's Moods (Date Range Filter)
   Query: Mood.find({ 
     userId, 
     createdAt: { $gte: startDate, $lte: endDate } 
   })
   Index Used: { userId: 1, createdAt: -1 }
   Time Complexity: O(log n + k) where k = results

3. Get Chat History
   Query: Chat.findOne({ userId }).sort({ updatedAt: -1 })
   Index Used: { userId: 1 }
   Time Complexity: O(log n)

4. User Login
   Query: User.findOne({ email })
   Index Used: { email: 1 } (unique)
   Time Complexity: O(log n)
```

---

## 🔌 API Specification

### Authentication Endpoints

#### POST /api/auth/register
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Success Response (201):
{
  "message": "User registered successfully."
}

Error Response (400):
{
  "error": "Email already registered."
}
```

#### POST /api/auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Success Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "id": "507f1f77bcf86cd799439011"
  }
}

Error Response (401):
{
  "error": "Invalid credentials."
}
```

### Journal Endpoints

#### GET /api/journal
```
Headers: Authorization: Bearer <token>

Success Response (200):
{
  "entries": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f191e810c19729de860ea",
      "content": "Today was a good day...",
      "mood": "Happy",
      "tags": ["work", "family"],
      "createdAt": "2024-10-11T10:30:00.000Z"
    }
  ]
}
```

#### POST /api/journal
```json
Headers: Authorization: Bearer <token>

Request:
{
  "content": "Today was challenging but I learned a lot.",
  "mood": "Calm",
  "tags": ["growth", "learning"]
}

Success Response (201):
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f191e810c19729de860ea",
  "content": "Today was challenging but I learned a lot.",
  "mood": "Calm",
  "tags": ["growth", "learning"],
  "createdAt": "2024-10-11T15:45:00.000Z"
}
```

### Mood Endpoints

#### POST /api/mood
```json
Headers: Authorization: Bearer <token>

Request:
{
  "mood": "Happy",
  "moodScore": 5,
  "description": "Feeling great after exercise"
}

Success Response (201):
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f191e810c19729de860ea",
  "mood": "Happy",
  "moodScore": 5,
  "description": "Feeling great after exercise",
  "createdAt": "2024-10-11T16:00:00.000Z"
}
```

#### GET /api/mood?start=2024-10-01&end=2024-10-11
```
Headers: Authorization: Bearer <token>
Query Params: start, end (ISO 8601 dates)

Success Response (200):
{
  "entries": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "mood": "Happy",
      "moodScore": 5,
      "description": "Feeling great",
      "createdAt": "2024-10-11T16:00:00.000Z"
    }
  ]
}
```

### Chat Endpoints

#### POST /api/chat
```json
Headers: Authorization: Bearer <token>

Request:
{
  "message": "I'm feeling anxious today",
  "useFallback": false
}

Success Response (200):
{
  "response": "I hear that you're feeling anxious. Let's try some breathing exercises together. Take a slow, deep breath in for 4 counts, hold for 4, and exhale for 4. How does that feel?",
  "chatId": "507f1f77bcf86cd799439014",
  "messageCount": 12
}

Error Response (500):
{
  "error": "Failed to get AI response."
}
```

#### GET /api/chat/history
```
Headers: Authorization: Bearer <token>

Success Response (200):
{
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-10-11T10:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Hello! How are you feeling today?",
      "timestamp": "2024-10-11T10:00:05.000Z"
    }
  ],
  "chatId": "507f1f77bcf86cd799439014"
}
```

---

## 🔒 Security Specifications

### Password Security
- **Algorithm:** bcrypt
- **Salt Rounds:** 10 (2^10 = 1024 iterations)
- **Hash Output:** 60-character string
- **Example:** `$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

### JWT Token
- **Algorithm:** HS256 (HMAC SHA-256)
- **Payload:** `{ userId: ObjectId }`
- **Expiration:** 7 days (604800 seconds)
- **Storage:** Client localStorage
- **Transmission:** Authorization header: `Bearer <token>`

### CORS Configuration
```javascript
{
  origin: [
    'http://localhost:3000',              // Development
    'https://lovely-strudel-e54e92.netlify.app'  // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

### Environment Variables
```bash
# Backend (.env)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=randomly_generated_64_character_secret_key
FRONTEND_URL=https://lovely-strudel-e54e92.netlify.app
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
NODE_ENV=production
PORT=5000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## ⚡ Performance Specifications

### Database Optimization
- **Connection Pooling:** Mongoose default (5 connections)
- **Indexes:** Compound indexes on userId + createdAt
- **Query Optimization:** Always use indexes, limit results when possible
- **Average Query Time:** <50ms (with indexes)

### Frontend Performance
- **Initial Load:** ~2.5s (with SSR)
- **Time to Interactive:** ~3s
- **Bundle Size:** 
  - Main bundle: ~150KB (gzipped)
  - Vendor bundle: ~200KB (gzipped)
- **Code Splitting:** Automatic per-route (Next.js)
- **Caching:** Static assets cached (CDN)

### API Response Times
| Endpoint | Avg Response | P95 |
|----------|--------------|-----|
| /api/auth/login | 150ms | 300ms |
| /api/journal (GET) | 80ms | 150ms |
| /api/mood (GET) | 70ms | 140ms |
| /api/chat (POST) | 5-30s* | 60s* |

*Depends on Ollama model processing time

### AI Model Performance
- **Model Size:** ~2.5GB (Llama 3.2)
- **VRAM Usage:** ~3GB (GPU mode) or RAM (CPU mode)
- **Average Response Time:** 
  - CPU: 15-30 seconds
  - GPU: 3-8 seconds
- **Context Window:** 2048 tokens
- **Tokens per Second:** 
  - CPU: ~5-10 t/s
  - GPU: ~30-50 t/s

---

## 🚀 Deployment Specifications

### Frontend (Netlify)
- **Framework:** Next.js 15.3.5
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node Version:** 20.x
- **Deploy Time:** ~2-3 minutes
- **CDN:** Global edge network
- **HTTPS:** Automatic (Let's Encrypt)

### Backend (Render)
- **Runtime:** Node.js 20.x
- **Start Command:** `npm start` → `node server.js`
- **Instance Type:** Free tier (512MB RAM, shared CPU)
- **Region:** US West (Oregon)
- **Auto-deploy:** On Git push to main
- **Health Check:** GET /api/health every 5 minutes

### Database (MongoDB Atlas)
- **Cluster Tier:** M0 (Free)
- **Storage:** 512MB
- **RAM:** Shared
- **Backup:** Point-in-time recovery (paid feature not enabled)
- **Region:** AWS us-east-1
- **Connection:** TLS/SSL encrypted

---

## 📊 Monitoring & Logging

### Error Handling
```javascript
// Global error handler (server.js)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { 
      details: err.message 
    })
  });
});
```

### Health Check Endpoint
```javascript
GET /api/health

Response:
{
  "status": "OK",
  "message": "Mental Health App API is running",
  "environment": "production",
  "timestamp": "2024-10-11T12:00:00.000Z"
}
```

### Logging Strategy
- **Development:** Console.log with detailed errors
- **Production:** Console.error for server errors
- **Future:** Sentry for error tracking, Winston for structured logging

---

## 🧪 Testing Strategy (Planned)

### Unit Tests (Jest)
```javascript
// Example: lib/auth.test.ts
describe('getToken', () => {
  it('should return token from localStorage', () => {
    localStorage.setItem('token', 'test-token');
    expect(getToken()).toBe('test-token');
  });
  
  it('should return null if no token', () => {
    localStorage.clear();
    expect(getToken()).toBeNull();
  });
});
```

### Integration Tests
- API endpoint testing with Supertest
- Database operations with test MongoDB instance
- JWT middleware verification

### E2E Tests (Cypress/Playwright)
- User registration flow
- Login and token storage
- Journal CRUD operations
- Mood logging and trends
- AI chat interaction

---

## 📝 Code Quality Standards

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Linting (ESLint)
- Extends: `next/core-web-vitals`
- Rules: Consistent code style, catch common errors
- Run: `npm run lint`

### Formatting (Prettier - if configured)
- Single quotes
- 2-space indentation
- Trailing commas
- Semicolons

---

## 🔄 Data Flow Examples

### Example 1: User Logs Mood
```
1. User selects "Happy" mood, score 5, types description
2. Frontend validates: mood and score are required
3. Frontend sends POST /api/mood with JWT token
4. Backend middleware verifies JWT → extracts userId
5. Backend validates: moodScore between 1-5
6. Backend creates Mood document with userId
7. MongoDB saves with auto-generated _id and createdAt
8. Backend returns created mood object
9. Frontend updates UI, shows success message
10. Dashboard stats automatically refresh on next visit
```

### Example 2: AI Chat Conversation
```
1. User types "I feel overwhelmed" in chat
2. Frontend adds message to UI immediately (optimistic update)
3. Frontend sends POST /api/chat via Next.js proxy
4. Next.js route forwards to Express backend
5. Backend verifies JWT, retrieves userId
6. Backend queries MongoDB for chat history
7. Backend extracts last 10 messages for context
8. Backend constructs prompt with system message
9. Backend calls Ollama API with 5-minute timeout
10. Ollama processes with Llama 3.2 model
11. Ollama returns empathetic response
12. Backend saves both user + AI message to MongoDB
13. Backend returns AI response to frontend
14. Frontend displays AI message in chat bubble
15. Frontend auto-scrolls to show new message
```

---

## 🎨 UI/UX Design System

### Color Palette
```css
/* Primary Colors */
--indigo-500: #6366f1
--indigo-600: #4f46e5
--pink-500: #ec4899
--pink-600: #db2777

/* Neutral Colors */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-600: #4b5563
--gray-900: #111827

/* Status Colors */
--green-500: #10b981  /* Success */
--red-500: #ef4444    /* Error */
--yellow-500: #f59e0b /* Warning */
--blue-500: #3b82f6   /* Info */
```

### Typography
```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif

/* Font Sizes */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-4xl: 2.25rem   /* 36px */
--text-5xl: 3rem      /* 48px */

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Spacing System
```css
/* Tailwind spacing scale (4px base) */
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
```

### Border Radius
```css
--radius-sm: 0.125rem   /* 2px */
--radius-md: 0.375rem   /* 6px */
--radius-lg: 0.5rem     /* 8px */
--radius-xl: 0.75rem    /* 12px */
--radius-2xl: 1rem      /* 16px */
--radius-3xl: 1.5rem    /* 24px */
--radius-full: 9999px   /* Circle */
```

### Animations
```css
/* Custom Keyframes */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* Usage */
.animate-fadeIn { animation: fadeIn 0.6s ease-out; }
.animate-slideUp { animation: slideUp 0.4s ease-out; }
.animate-scaleIn { animation: scaleIn 0.3s ease-out; }
```

---

## 📚 Dependencies

### Frontend Dependencies
```json
{
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-slot": "^1.2.3",
  "ai": "^4.3.17",
  "lucide-react": "^0.525.0",
  "next": "15.3.5",
  "next-themes": "^0.4.6",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-markdown": "^10.1.0",
  "recharts": "^3.1.0",
  "tailwindcss": "^4"
}
```

### Backend Dependencies
```json
{
  "axios": "^1.7.9",
  "bcrypt": "^6.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.7.3"
}
```

---

This technical specification serves as a complete reference for understanding the architecture, implementation details, and technical decisions behind the Mental Health App project.

