'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getToken } from '@/lib/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  token?: string;
}

export default function Chatbot({ token: propToken }: ChatbotProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize token from prop or localStorage
  useEffect(() => {
    const resolveToken = propToken || getToken();
    console.log('[Chatbot] useEffect: Token resolved:', resolveToken ? `✓ exists (${resolveToken.substring(0, 20)}...)` : '✗ undefined');
    setToken(resolveToken);
  }, [propToken]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Load chat history on component mount
  useEffect(() => {
    console.log('[Chatbot] useEffect: Checking token, value:', token ? '✓ exists' : '✗ undefined');
    if (token) {
      console.log('[Chatbot] useEffect: Token available, loading chat history');
      loadChatHistory();
    } else {
      console.warn('[Chatbot] useEffect: No token available - skipping chat history load');
    }
  }, [token]);

  const loadChatHistory = async () => {
    try {
      console.log('[Chatbot] loadChatHistory: Starting, token:', token ? '✓ has token' : '✗ no token');
      const response = await fetch('/api/chat', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('[Chatbot] loadChatHistory: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[Chatbot] loadChatHistory: ✓ Success, messages:', data.messages?.length || 0);
        const formattedMessages = data.messages.map((msg: any) => ({
          id: msg._id || Date.now().toString(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }));
        setChatHistory(formattedMessages);
      } else {
        console.error('[Chatbot] loadChatHistory: ✗ Failed with status', response.status);
        if (response.status === 401) {
          console.error('[Chatbot] loadChatHistory: Unauthorized - token may be invalid');
        }
      }
    } catch (error) {
      console.error('[Chatbot] loadChatHistory: ✗ Error:', error);
    }
  };

  const clearChatHistory = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setChatHistory([]);
        setError(null);
      }
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      setError('Failed to clear chat history.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    console.log('[Chatbot] handleFormSubmit: Starting, token:', token ? '✓ has token' : '✗ no token');

    setIsLoading(true);
    setError(null);

    // Add user message to chat history immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      console.log('[Chatbot] handleFormSubmit: Sending message, useFallback:', useFallback);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          useFallback: useFallback,
        })
      });

      console.log('[Chatbot] handleFormSubmit: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[Chatbot] handleFormSubmit: ✓ Got response from backend');
        const newMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setChatHistory(prev => [...prev, newMessage]);
      } else {
        const errorText = await response.text();
        console.error('[Chatbot] handleFormSubmit: ✗ Response failed:', response.status, errorText);
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('[Chatbot] handleFormSubmit: ✗ Error:', error);
      setError('Failed to send message. Please try again or switch to fallback mode.');
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto glassmorphism rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Mental Health Assistant</h2>
            <p className="text-blue-100 text-sm">Your compassionate AI companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadChatHistory}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 group"
            title="Refresh chat"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button
            onClick={clearChatHistory}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 group"
            title="Clear chat history"
          >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* AI Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-white/20">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="ollama-mode"
              name="ai-mode"
              checked={!useFallback}
              onChange={() => setUseFallback(false)}
              className="w-4 h-4 text-blue-600 rounded-full border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="ollama-mode" className="text-sm font-medium text-gray-700 cursor-pointer">
              Ollama (Local AI)
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="fallback-mode"
              name="ai-mode"
              checked={useFallback}
              onChange={() => setUseFallback(true)}
              className="w-4 h-4 text-blue-600 rounded-full border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="fallback-mode" className="text-sm font-medium text-gray-700 cursor-pointer">
              Fallback (Local Responses)
            </label>
          </div>
        </div>
        {useFallback && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Local responses only</span>
          </div>
        )}
        {!useFallback && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <Bot className="w-4 h-4" />
            <span className="text-xs font-medium">Local Llama model</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white/50 to-blue-50/30">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-12 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to your mental health assistant</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              I'm here to listen and support you. Feel free to share what's on your mind, ask for advice, or just chat.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-blue-600 font-medium">Start a conversation below</span>
            </div>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-6 py-4 shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-white/20'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl animate-slide-up">
          <div className="flex items-center space-x-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/50 border-t border-white/20">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 pr-12"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 font-semibold"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {isLoading && (
          <div className="mt-3 text-sm text-gray-500 flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span>Sending message...</span>
          </div>
        )}
      </form>
    </div>
  );
}
