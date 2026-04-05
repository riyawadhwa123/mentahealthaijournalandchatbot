'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import API_BASE_URL from '@/lib/api';
import { 
  BookOpen, 
  MessageCircle, 
  BarChart3, 
  Plus, 
  TrendingUp, 
  Heart,
  Calendar,
  Activity,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface DashboardStats {
  journalEntries: number;
  moodEntries: number;
  chatMessages: number;
  lastMood: string;
  lastMoodDate: string;
  lastMoodScore: number | null;
}

const MOODS = [
  { label: 'Happy', emoji: '😊', score: 5 },
  { label: 'Excited', emoji: '🤩', score: 5 },
  { label: 'Calm', emoji: '😌', score: 4 },
  { label: 'Tired', emoji: '😴', score: 2 },
  { label: 'Sad', emoji: '😢', score: 1 },
  { label: 'Angry', emoji: '😠', score: 1 },
  { label: 'Anxious', emoji: '😰', score: 2 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    journalEntries: 0,
    moodEntries: 0,
    chatMessages: 0,
    lastMood: 'Not recorded',
    lastMoodDate: 'Never',
    lastMoodScore: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [moodForm, setMoodForm] = useState({ mood: '', moodScore: 0, description: '' });
  const [moodSubmitting, setMoodSubmitting] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      const token = getToken();
      if (!token) return;

      // Load journal entries count
      const journalResponse = await fetch(`${API_BASE_URL}/api/journal`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Load mood entries count
      const moodResponse = await fetch(`${API_BASE_URL}/api/mood`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Load chat history
      const chatResponse = await fetch(`${API_BASE_URL}/api/chat/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const journalData = journalResponse.ok ? await journalResponse.json() : { entries: [] };
      const moodData = moodResponse.ok ? await moodResponse.json() : { entries: [] };
      const chatData = chatResponse.ok ? await chatResponse.json() : { messages: [] };

      setStats({
        journalEntries: journalData.entries?.length || 0,
        moodEntries: moodData.entries?.length || 0,
        chatMessages: chatData.messages?.length || 0,
        lastMood: moodData.entries?.[0]?.mood || 'Not recorded',
        lastMoodDate: moodData.entries?.[0]?.createdAt ? new Date(moodData.entries[0].createdAt).toLocaleDateString() : 'Never',
        lastMoodScore: moodData.entries?.[0]?.moodScore || null,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moodForm.mood || !moodForm.moodScore) return;
    setMoodSubmitting(true);
    try {
      const token = getToken();
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/api/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(moodForm),
      });
      if (response.ok) {
        setShowMoodForm(false);
        setMoodForm({ mood: '', moodScore: 0, description: '' });
        loadDashboardData();
      }
    } catch (error) {
      // Optionally show error
    } finally {
      setMoodSubmitting(false);
    }
  };

  const handleReset = async () => {
    const totalEntries = stats.journalEntries + stats.moodEntries;
    if (totalEntries === 0) {
      alert('No entries to reset!');
      return;
    }

    const confirmMessage = `Are you sure you want to reset your data?\n\nThis will permanently delete:\n• ${stats.journalEntries} journal ${stats.journalEntries === 1 ? 'entry' : 'entries'}\n• ${stats.moodEntries} mood ${stats.moodEntries === 1 ? 'entry' : 'entries'}\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsResetting(true);
    try {
      const token = getToken();
      if (!token) return;

      // Delete all journal entries
      const journalResponse = await fetch(`${API_BASE_URL}/api/journal`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Delete all mood entries
      const moodResponse = await fetch(`${API_BASE_URL}/api/mood`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (journalResponse.ok && moodResponse.ok) {
        const journalResult = await journalResponse.json();
        const moodResult = await moodResponse.json();
        
        alert(`Reset successful!\n\nDeleted:\n• ${journalResult.deletedCount} journal ${journalResult.deletedCount === 1 ? 'entry' : 'entries'}\n• ${moodResult.deletedCount} mood ${moodResult.deletedCount === 1 ? 'entry' : 'entries'}`);
        
        // Reload dashboard data to reflect changes
        loadDashboardData();
      } else {
        alert('Failed to reset data. Please try again.');
      }
    } catch (error) {
      console.error('Reset error:', error);
      alert('Failed to reset data. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen soft-gradient flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.1s' }}></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen soft-gradient">
      <div className="container mx-auto px-4 md:px-8 py-12 w-full max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center animate-fadeIn">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-indigo-800 to-pink-800 dark:from-white dark:via-indigo-200 dark:to-pink-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your mental health journey and stay connected with your well-being
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 flex flex-col items-center group hover:scale-105 transition-all duration-300 animate-slideUp">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Journal Entries</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-600 bg-clip-text text-transparent">{stats.journalEntries}</p>
          </div>
          
          <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 flex flex-col items-center group hover:scale-105 transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Mood Entries</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-800 dark:from-pink-400 dark:to-rose-600 bg-clip-text text-transparent">{stats.moodEntries}</p>
            <button
              className="mt-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
              onClick={() => setShowMoodForm(true)}
            >
              Log Mood
            </button>
          </div>
          
          <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 flex flex-col items-center group hover:scale-105 transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Chat Messages</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-800 dark:from-emerald-400 dark:to-teal-600 bg-clip-text text-transparent">{stats.chatMessages}</p>
          </div>
          
          <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 flex flex-col items-center group hover:scale-105 transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Last Mood</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">{stats.lastMood}</p>
            {stats.lastMoodScore !== null && stats.lastMoodScore !== undefined && (
              <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-800 dark:from-purple-400 dark:to-violet-600 bg-clip-text text-transparent">
                Score: {stats.lastMoodScore}/5
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{stats.lastMoodDate}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Link href="/journal" className="group">
            <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 hover:scale-105 transition-all duration-300 flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Write Journal Entry</h3>
                <p className="text-gray-600 dark:text-gray-300">Reflect on your thoughts and feelings</p>
              </div>
            </div>
          </Link>
          
          <Link href="/chat" className="group">
            <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 hover:scale-105 transition-all duration-300 flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chat with AI</h3>
                <p className="text-gray-600 dark:text-gray-300">Get support and guidance</p>
              </div>
            </div>
          </Link>
          
          <Link href="/mood-trends" className="group">
            <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 hover:scale-105 transition-all duration-300 flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">View Mood Trends</h3>
                <p className="text-gray-600 dark:text-gray-300">Track your emotional patterns</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Reset Data Section */}
        {(stats.journalEntries > 0 || stats.moodEntries > 0) && (
          <div className="mb-12">
            <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reset Your Data</h3>
                  <p className="text-gray-600 dark:text-gray-300">Start fresh by clearing all your entries</p>
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Warning</h4>
                    <p className="text-orange-700 dark:text-orange-300 text-sm">
                      This will permanently delete all your journal entries ({stats.journalEntries}) and mood entries ({stats.moodEntries}). 
                      This action cannot be undone. Chat history will remain intact.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
              >
                {isResetting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset All Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Recent Activity
          </h2>
          <div className="space-y-6">
            {stats.journalEntries === 0 && stats.moodEntries === 0 && stats.chatMessages === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No activity yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                  Start by writing a journal entry, logging your mood, or chatting with our AI assistant!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setShowMoodForm(true)}
                    className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Log Your First Mood
                  </button>
                  <Link href="/journal">
                    <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold">
                      Write Journal Entry
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.journalEntries > 0 && (
                  <div className="flex items-center space-x-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {stats.journalEntries} journal {stats.journalEntries === 1 ? 'entry' : 'entries'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Your thoughts and reflections</p>
                    </div>
                  </div>
                )}
                {stats.moodEntries > 0 && (
                  <div className="flex items-center space-x-4 p-4 bg-pink-50/50 dark:bg-pink-900/20 rounded-2xl border border-pink-100 dark:border-pink-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {stats.moodEntries} mood {stats.moodEntries === 1 ? 'entry' : 'entries'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Your emotional journey</p>
                    </div>
                  </div>
                )}
                {stats.chatMessages > 0 && (
                  <div className="flex items-center space-x-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {stats.chatMessages} chat {stats.chatMessages === 1 ? 'message' : 'messages'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Your conversations with AI</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mood Entry Modal/Form */}
      {showMoodForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="glassmorphism dark:glassmorphism-dark rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 animate-scaleIn">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Log Your Mood</h2>
            </div>
            <form onSubmit={handleMoodSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Mood <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {MOODS.map((m) => (
                    <button
                      type="button"
                      key={m.label}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        moodForm.mood === m.label 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 border-pink-500 text-white shadow-lg' 
                          : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                      }`}
                      onClick={() => setMoodForm({ ...moodForm, mood: m.label, moodScore: m.score })}
                      aria-pressed={moodForm.mood === m.label}
                    >
                      <span className="text-2xl mr-2">{m.emoji}</span>
                      <span className="font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Mood Score <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={moodForm.moodScore || 3}
                      onChange={e => setMoodForm({ ...moodForm, moodScore: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-rose-800 dark:from-pink-400 dark:to-rose-600 bg-clip-text text-transparent">
                      {moodForm.moodScore || 3}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>😢 1</span>
                    <span>😐 2</span>
                    <span>😊 3</span>
                    <span>😄 4</span>
                    <span>🤩 5</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Description (optional)</label>
                <textarea
                  value={moodForm.description}
                  onChange={e => setMoodForm({ ...moodForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 resize-none text-gray-900 dark:text-white"
                  placeholder="Add a note about your mood..."
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={moodSubmitting || !moodForm.mood || !moodForm.moodScore}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 px-6 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 font-semibold"
                >
                  {moodSubmitting ? 'Saving...' : 'Save Mood'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMoodForm(false)}
                  className="px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
