# AI Chatbot Integration

This document outlines the AI Chatbot Integration features implemented in the Mental Health App.

## Features Implemented

### 1. Backend API Enhancement
- **Chat Model**: New MongoDB schema for storing chat history with user context
- **Enhanced Chat Routes**: Updated `/api/chat` endpoint with:
  - Chat history storage and retrieval
  - Context-aware conversations (last 10 messages)
  - Ollama integration for local AI responses
  - Fallback mechanism for when Ollama is unavailable
  - Additional routes for chat history management

### 2. Frontend API Route
- **Next.js API Route**: `/api/chat/route.ts` that:
  - Forwards requests to the backend
  - Manages authentication headers
  - Provides fallback mode support

### 3. Chatbot Component
- **Local AI Integration**: Uses Ollama for local AI responses
- **Chat History**: Loads and displays previous conversations
- **Mode Selection**: Users can switch between Ollama and fallback responses
- **Markdown Support**: Renders AI responses with proper formatting
- **Error Handling**: Graceful error handling and user feedback

### 4. Authentication Integration
- **Token Management**: Secure authentication with JWT tokens
- **Protected Routes**: All chat functionality requires authentication
- **User Context**: Chat history is tied to specific users

## API Endpoints

### Backend (Express.js)
- `POST /api/chat` - Send message and get AI response
- `GET /api/chat/history` - Retrieve chat history
- `DELETE /api/chat/history` - Clear chat history

### Frontend (Next.js)
- `POST /api/chat` - Forward to backend with streaming support
- `GET /api/chat` - Get chat history
- `DELETE /api/chat` - Clear chat history

## AI Modes

The system provides two modes:
- **Ollama Mode**: Uses local Llama models for AI responses
- **Fallback Mode**: Uses pre-defined empathetic responses when Ollama is unavailable
- **Context-Aware**: Different responses based on message content
- **User Toggle**: Users can manually switch between modes
- **Automatic Fallback**: Automatic switch when Ollama fails

## Database Schema

```javascript
// Chat Model
{
  userId: ObjectId,
  messages: [{
    role: String, // 'user', 'assistant', 'system'
    content: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

### Frontend (.env.local)
```
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Usage

1. **Install Ollama**: Download from [ollama.ai](https://ollama.ai/)
2. **Pull Model**: `ollama pull llama3.2`
3. **Start Backend**: `cd backend && npm start`
4. **Start Frontend**: `cd mental-health-app && npm run dev`
5. **Register/Login**: Create an account or sign in
6. **Access Chat**: Navigate to `/chat` page
7. **Choose Mode**: Select between Ollama or Fallback mode

## Security Features

- **JWT Authentication**: All chat requests require valid tokens
- **User Isolation**: Chat history is isolated per user
- **Input Validation**: Server-side validation of all inputs
- **Error Handling**: Secure error responses without exposing internals

## Future Enhancements

- **Llama Integration**: Local Llama model support
- **Conversation Analytics**: Track conversation patterns
- **Mood Integration**: Connect chat with mood tracking
- **Professional Resources**: Direct links to mental health professionals
- **Crisis Detection**: AI-powered crisis detection and intervention

## Troubleshooting

### Common Issues

1. **Ollama Connection Errors**: Check if Ollama is running on port 11434
2. **Model Not Found**: Run `ollama pull llama3.2` to download the model
3. **CORS Issues**: Ensure backend CORS is configured
4. **Authentication Errors**: Verify JWT token validity

### Debug Mode

Enable debug logging by setting:
```
DEBUG=true
```

This will provide detailed logs for API calls and responses. 