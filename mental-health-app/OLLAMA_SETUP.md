# Ollama Setup Guide

This guide will help you set up Ollama (local Llama models) for the Mental Health App.

## What We've Done

✅ **Removed OpenAI** - No more API costs or quota issues  
✅ **Added Ollama support** - Local AI models  
✅ **Simplified options** - Just 2 modes: Ollama or Fallback  
✅ **Removed dependencies** - No more OpenAI package  

## Setup Steps

### 1. Install Ollama

**Windows:**
```bash
# Download from https://ollama.ai/
# Or use winget:
winget install Ollama.Ollama
```

**macOS:**
```bash
# Download from https://ollama.ai/
# Or use Homebrew:
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Start Ollama and Pull Model

```bash
# Start Ollama service
ollama serve

# In another terminal, pull a model
ollama pull llama3.2
```

### 3. Environment Variables

**Backend (.env file in backend folder):**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
PORT=5000
```

**Frontend (.env.local file in mental-health-app folder):**
```
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install Dependencies

```bash
# Backend
cd mental-health-app/backend
npm install

# Frontend
cd mental-health-app
npm install
```

### 5. Start the App

```bash
# Start backend
cd mental-health-app/backend
npm start

# Start frontend (in new terminal)
cd mental-health-app
npm run dev
```

## Usage

### Option 1: Ollama (Local AI)
- Select "Ollama (Local AI)" radio button
- Uses your local Llama model
- No API costs, privacy guaranteed
- Requires Ollama to be running

### Option 2: Fallback (Local Responses)
- Select "Fallback (Local Responses)" radio button
- Uses pre-written empathetic responses
- Works immediately without setup
- No AI model required

## Available Models

You can use different Llama models:

```bash
# Llama 3.2 (recommended)
ollama pull llama3.2

# Llama 3.1 (smaller, faster)
ollama pull llama3.1

# Code Llama (good for technical discussions)
ollama pull codellama

# Mistral (good alternative)
ollama pull mistral
```

## Troubleshooting

### Ollama Not Running
```bash
# Check if Ollama is running
ollama list

# Start Ollama
ollama serve
```

### Model Not Found
```bash
# List available models
ollama list

# Pull the model again
ollama pull llama3.2
```

### Port Issues
- Make sure port 11434 is available
- Check if Ollama is running on the correct port

## Benefits

✅ **No API costs** - Runs locally  
✅ **Privacy** - Data stays on your machine  
✅ **No rate limits** - Use as much as you want  
✅ **Offline capability** - Works without internet  
✅ **Multiple models** - Choose the best for your needs  

## Next Steps

1. **Install Ollama** from [ollama.ai](https://ollama.ai/)
2. **Pull a model**: `ollama pull llama3.2`
3. **Start your app** and test the chat
4. **Choose your preferred mode** (Ollama or Fallback)

The app is now much simpler and more cost-effective! 