# 📋 Interview Quick Reference Cheat Sheet

## 🚀 30-Second Elevator Pitch
*"I built a full-stack mental health web app with journaling, mood tracking, and an AI chatbot powered by Llama 3.2. It uses Next.js + TypeScript on the frontend, Node.js + Express backend, MongoDB database, and Ollama for local AI. Users can track emotional patterns over time, write journal entries, and get immediate support from an empathetic AI assistant. It's deployed on Netlify (frontend) and Render (backend)."*

---

## 🎯 Core Technologies (Quick Recall)

### Frontend Stack
- **Next.js 15** - SSR, App Router, API routes
- **React 19** - Hooks (useState, useEffect, useRef)
- **TypeScript** - Type safety
- **TailwindCSS v4** - Utility-first styling, custom animations
- **shadcn/ui** - Accessible components (Button, Card, Textarea)
- **Recharts** - Mood trend visualization
- **Lucide React** - Icons
- **React Markdown** - AI response rendering

### Backend Stack
- **Node.js + Express** - RESTful API
- **MongoDB + Mongoose** - NoSQL database with ODM
- **JWT** - Token-based authentication (7-day expiry)
- **Bcrypt** - Password hashing (10 salt rounds)
- **Ollama** - Local AI server (Llama 3.2 model)
- **CORS** - Cross-origin security

---

## 🏗️ Architecture Quick View

```
Frontend (Netlify)          Backend (Render)           Database
┌─────────────────┐        ┌──────────────────┐      ┌──────────────┐
│   Next.js App   │───────▶│  Express Server  │─────▶│   MongoDB    │
│   - Dashboard   │ JWT    │  - Auth Routes   │      │    Atlas     │
│   - Journal     │ Auth   │  - Journal API   │      │              │
│   - Mood Trends │        │  - Mood API      │      │  Collections:│
│   - AI Chat     │        │  - Chat API      │      │  - users     │
└─────────────────┘        └──────────┬───────┘      │  - journals  │
                                      │              │  - moods     │
                                      │              │  - chats     │
                                      ▼              └──────────────┘
                           ┌──────────────────┐
                           │  Ollama Server   │
                           │  (Llama 3.2 AI)  │
                           └──────────────────┘
```

---

## 🔐 Authentication Flow (Quick Recap)

**Registration:**
1. User submits email, password, name
2. Backend checks if email exists
3. Hash password with bcrypt (10 rounds)
4. Save to MongoDB → Success message

**Login:**
1. User submits credentials
2. Find user by email
3. Compare password with `bcrypt.compare()`
4. Generate JWT token (userId payload, 7-day expiry)
5. Return token + user info

**Authorization:**
- Every request includes: `Authorization: Bearer <token>`
- Middleware verifies token with `jwt.verify()`
- If valid, attach `req.user.id` → continue
- If invalid → 401 Unauthorized

---

## 📊 Database Schema (Quick Reference)

```javascript
User {
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date
}

Journal {
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  content: String,
  mood: String,
  tags: [String],
  createdAt: Date
}

Mood {
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  mood: String,
  moodScore: Number (1-5),
  description: String,
  createdAt: Date
}

Chat {
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  messages: [{ role, content, timestamp }],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `userId + createdAt` (compound), `email` (unique)

---

## 🤖 AI Chatbot Flow (Key Technical Feature)

```
1. User types message
2. Frontend → Next.js API route (proxy)
3. Next.js → Express backend
4. Backend retrieves last 10 messages from MongoDB
5. Construct prompt: SYSTEM_PROMPT + history + new message
6. Call Ollama API (http://localhost:11434/api/generate)
   - Model: llama3.2
   - Temperature: 0.7
   - Timeout: 5 minutes
7. Ollama processes and returns response
8. Save user message + AI response to MongoDB
9. Return to frontend → Display in chat
```

**Fallback:** Rule-based responses if Ollama fails (keyword matching)

---

## 🎨 Key Features (Quick List)

1. **Dashboard** - Stats, quick actions, mood logger
2. **Journal** - CRUD operations, mood selection, chronological display
3. **Mood Trends** - Analytics (7d/30d avg, best/worst, streak), line chart, history table
4. **AI Chat** - Conversational support, history persistence, Ollama/Fallback modes
5. **Auth** - Register, login, JWT protection, logout
6. **Dark Mode** - Toggle with localStorage persistence

---

## 🔥 Technical Challenges & Solutions (For Storytelling)

| Challenge | Solution |
|-----------|----------|
| **Ollama Timeouts** | 5-min timeout, fallback mode, loading states, user toggle |
| **CORS Errors** | Configured corsOptions with production origins |
| **JWT Expiration** | Global 401 handling, clear error messages, 7-day expiry |
| **MongoDB Connections** | Moved to server startup, Mongoose pooling |
| **Chat Context** | Limited to last 10 messages (balance context & performance) |
| **Mobile Responsive** | Mobile-first design, Tailwind breakpoints, hamburger menu |

---

## 🚢 Deployment (Quick Reference)

**Frontend (Netlify):**
- GitHub auto-deploy on push
- ENV: `NEXT_PUBLIC_API_URL=https://backend.onrender.com`
- CDN distributed, HTTPS default

**Backend (Render):**
- GitHub auto-deploy
- ENV: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `OLLAMA_URL`
- Health check: `/api/health`

**Database (MongoDB Atlas):**
- Free M0 cluster
- Automated backups
- Connection string in ENV

---

## 💡 Why This Tech Stack? (Quick Justifications)

| Technology | Why? |
|------------|------|
| **Next.js** | SSR, API routes, code splitting, production-ready |
| **MongoDB** | Flexible schema, JSON-native, Mongoose ORM, free Atlas tier |
| **JWT** | Stateless, scalable, cross-domain, mobile-ready |
| **Ollama** | Free, private, customizable, no vendor lock-in |
| **TailwindCSS** | Rapid development, consistent design, small bundle |
| **TypeScript** | Type safety, better IDE support, catch errors early |

---

## 📈 Future Enhancements (Show Forward Thinking)

**Short-term:**
1. Email verification & password reset
2. Enhanced analytics (mood correlation, export data)
3. Journal search & filtering
4. Rich text editor
5. Testing suite (Jest, Cypress)

**Medium-term:**
6. React Native mobile app
7. Social features (anonymous sharing)
8. Advanced AI (sentiment analysis, insights)
9. Professional integration (therapist connect)
10. Gamification (badges, streaks)

**Long-term:**
11. Voice journaling
12. Wearable integration (Fitbit, Apple Watch)
13. Multi-language support
14. Enterprise version for HR teams
15. Research partnerships

---

## 🎤 Rapid-Fire Q&A Answers

**Q: Biggest challenge?**
"Integrating Ollama with inconsistent response times. Solved with timeouts, fallback mode, and user toggles."

**Q: How to scale?**
"Redis caching, DB read replicas, load balancer, CDN, WebSockets for real-time chat."

**Q: Security measures?**
"Bcrypt hashing, JWT auth, HTTPS, CORS restrictions, input validation, secure env vars."

**Q: What differently?**
"TypeScript on backend, testing from start, microservices architecture, Material-UI design system."

**Q: Favorite part?**
"AI integration - engineering prompts, managing context, implementing fallbacks. Meaningful project helping mental health."

---

## 🗂️ File Structure (Know Where Everything Is)

```
mental-health-app/
├── src/app/                    # Next.js pages
│   ├── dashboard/page.tsx      # Main dashboard
│   ├── journal/page.tsx        # Journal CRUD
│   ├── mood-trends/page.tsx    # Analytics & charts
│   ├── chat/page.tsx           # AI chat interface
│   ├── login/page.tsx          # Authentication
│   └── api/chat/route.ts       # Proxy to backend
├── src/components/             # Reusable components
│   ├── Navbar.tsx              # Navigation + dark mode
│   ├── Chatbot.tsx             # Chat UI
│   ├── MoodTrendsChart.tsx     # Recharts graph
│   └── ui/                     # shadcn components
├── src/lib/                    # Utilities
│   ├── auth.ts                 # Token management
│   ├── api.ts                  # API endpoints
│   └── utils.ts                # Helpers
└── backend/
    ├── server.js               # Express entry
    └── src/
        ├── models/             # Mongoose schemas
        ├── routes/             # API endpoints
        └── middleware/auth.js  # JWT verification
```

---

## 🎯 API Endpoints (Quick Reference)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create user |
| POST | `/api/auth/login` | ❌ | Get JWT token |
| GET | `/api/journal` | ✅ | List journals |
| POST | `/api/journal` | ✅ | Create journal |
| PUT | `/api/journal/:id` | ✅ | Update journal |
| DELETE | `/api/journal/:id` | ✅ | Delete journal |
| DELETE | `/api/journal` | ✅ | Delete all journals |
| GET | `/api/mood` | ✅ | List moods (date filter) |
| POST | `/api/mood` | ✅ | Create mood |
| DELETE | `/api/mood/:id` | ✅ | Delete mood |
| DELETE | `/api/mood` | ✅ | Delete all moods |
| POST | `/api/chat` | ✅ | Send AI message |
| GET | `/api/chat/history` | ✅ | Get chat history |
| DELETE | `/api/chat/history` | ✅ | Clear history |
| GET | `/api/health` | ❌ | Server status |

---

## 💪 Closing Statement Template

"This project showcases my ability to build production-ready full-stack applications with modern technologies. I integrated cutting-edge AI, implemented secure authentication, designed an intuitive UI, and deployed to production. The mental health focus demonstrates my passion for creating meaningful applications. I'm excited to bring these skills to [COMPANY NAME] and contribute to [SPECIFIC TEAM/PROJECT]."

---

## ⚡ Pre-Interview Checklist

- [ ] Review this cheat sheet (5 min)
- [ ] Have project open in browser (live demo ready)
- [ ] Have codebase open in VSCode (specific files ready)
- [ ] Test all features (ensure everything works)
- [ ] Prepare 2-3 code examples to screen share
- [ ] Review job description (connect your project to their needs)
- [ ] Practice 30-second elevator pitch (3 times)
- [ ] Prepare 2-3 questions for interviewer
- [ ] Get water, good lighting, quiet space
- [ ] Take deep breath, you got this! 🚀

---

**Remember:** Enthusiasm + Clarity + Confidence = Great Interview!

Good luck! 🌟

