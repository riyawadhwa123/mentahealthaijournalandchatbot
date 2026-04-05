const express = require('express');
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');

const router = express.Router();

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
// FALLBACK_MODEL = 'llama3.2'; // Original model - uncomment if llama2:7b doesn't work
const OLLAMA_TIMEOUT = 300000; // 5 minute timeout

const SYSTEM_PROMPT = `You are an empathetic, supportive AI assistant inspired by Wysa, designed to provide mental health support. Respond with kindness, understanding, and practical advice. Avoid clinical or overly technical language. If the user expresses distress, suggest grounding techniques or journaling prompts, and gently encourage seeking professional help if needed.`;

// Function to call Ollama API with timeout
const callOllama = async (messages) => {
  try {
    console.log('callOllama: Converting messages to prompt format');
    // Convert messages to prompt format for Ollama
    const prompt = messages.map(msg => {
      if (msg.role === 'system') {
        return `System: ${msg.content}\n`;
      } else if (msg.role === 'user') {
        return `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        return `Assistant: ${msg.content}\n`;
      }
    }).join('') + 'Assistant: ';

    console.log('callOllama: Sending POST to', `${OLLAMA_URL}/api/generate`);
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT);

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 400 // Allow longer, more detailed responses
        }
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('callOllama: Response status', response.status);

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('callOllama: Success, response length:', data.response.length);
    return data.response;
  } catch (error) {
    console.error('callOllama: Error -', error.message);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Ollama is taking too long to respond');
    }
    throw error;
  }
};

// Fallback response when AI services are unavailable
const getFallbackResponse = (message) => {
  const fallbackResponses = {
    greeting: "Hello! I'm here to support you. How are you feeling today?",
    distress: "I hear that you're going through a difficult time. Remember to breathe deeply and know that it's okay to not be okay. Would you like to talk about what's on your mind?",
    anxiety: "Anxiety can feel overwhelming. Try taking slow, deep breaths - inhale for 4 counts, hold for 4, exhale for 4. This can help calm your nervous system.",
    depression: "I'm sorry you're feeling this way. Remember that your feelings are valid and temporary. Consider reaching out to a trusted friend or mental health professional.",
    default: "I'm here to listen and support you. What would be most helpful for you right now?"
  };

  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) return fallbackResponses.greeting;
  if (lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) return fallbackResponses.anxiety;
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('hopeless')) return fallbackResponses.depression;
  if (lowerMessage.includes('help') || lowerMessage.includes('crisis') || lowerMessage.includes('emergency')) return fallbackResponses.distress;
  
  return fallbackResponses.default;
};

// POST /api/chat/ - Chatbot interaction with history
router.post('/', auth, async (req, res) => {
  try {
    const { message, useFallback = false } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Get or create chat history for the user
    let chat = await Chat.findOne({ userId }).sort({ updatedAt: -1 });
    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    // Add user message to history
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    let aiResponse;
    
    if (useFallback) {
      // Use fallback response (instant)
      aiResponse = getFallbackResponse(message);
    } else {
      try {
        // Prepare messages for Ollama (restore to last 10 messages for context)
        const recentMessages = chat.messages.slice(-10); // Use 10 for context as before
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ];

        console.log('Calling Ollama with model:', OLLAMA_MODEL, 'at', OLLAMA_URL);
        // Call Ollama API with timeout
        aiResponse = await callOllama(messages);
        console.log('Ollama response received:', aiResponse.substring(0, 50) + '...');
      } catch (ollamaError) {
        console.error('Ollama API error:', ollamaError.message);
        console.error('Full error:', ollamaError);
        // Fallback to local response
        aiResponse = getFallbackResponse(message);
      }
    }

    // Add AI response to history
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    // Save updated chat history
    await chat.save();

    res.json({ 
      response: aiResponse,
      chatId: chat._id,
      messageCount: chat.messages.length
    });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
});

// GET /api/chat/history - Get chat history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const chat = await Chat.findOne({ userId }).sort({ updatedAt: -1 });
    
    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({ 
      messages: chat.messages,
      chatId: chat._id
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get chat history.' });
  }
});

// DELETE /api/chat/history - Clear chat history
router.delete('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    await Chat.deleteMany({ userId });
    res.json({ message: 'Chat history cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear chat history.' });
  }
});

module.exports = router; 