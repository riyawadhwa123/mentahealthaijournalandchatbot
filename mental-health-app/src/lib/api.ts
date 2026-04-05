// API Configuration for development and production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // Journal endpoints
  JOURNAL: `${API_BASE_URL}/api/journal`,
  JOURNAL_ENTRY: (id: string) => `${API_BASE_URL}/api/journal/${id}`,
  
  // Mood endpoints
  MOOD: `${API_BASE_URL}/api/mood`,
  MOOD_ENTRY: (id: string) => `${API_BASE_URL}/api/mood/${id}`,
  
  // Chat endpoints
  CHAT: `${API_BASE_URL}/api/chat`,
  CHAT_HISTORY: `${API_BASE_URL}/api/chat/history`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL; 