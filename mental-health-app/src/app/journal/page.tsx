'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import { Plus, BookOpen, Heart, Calendar, Trash2, Edit3 } from 'lucide-react';
import API_BASE_URL from '@/lib/api';

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  createdAt: string;
}

const MOODS = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Excited', emoji: '🤩' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Angry', emoji: '😠' },
  { label: 'Anxious', emoji: '😰' },
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ content: '', mood: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    loadEntries();
  }, [router]);

  const loadEntries = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/journal`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content || !formData.mood) return;

    setIsSubmitting(true);
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ content: '', mood: '' });
        setShowForm(false);
        loadEntries();
      }
    } catch (error) {
      console.error('Failed to create journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/journal/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadEntries();
      }
    } catch (error) {
      console.error('Failed to delete journal entry:', error);
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
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 font-medium">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen soft-gradient">
      <div className="container mx-auto px-4 md:px-8 py-12 w-full max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center animate-fadeIn">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-indigo-800 to-pink-800 dark:from-white dark:via-indigo-200 dark:to-pink-200 bg-clip-text text-transparent">
              Journal
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Reflect on your thoughts, feelings, and experiences
          </p>
        </div>

        {/* New Entry Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold text-lg animate-bounceIn"
          >
            <Plus className="w-6 h-6" />
            <span>Write New Entry</span>
          </button>
        </div>

        {/* Journal Entries */}
        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-12 text-center animate-slideUp">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No journal entries yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Start your journaling journey by writing your first entry. It's a great way to reflect on your day and track your emotional well-being.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold text-lg"
              >
                Write Your First Entry
              </button>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={entry.id || index}
                className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl">
                        {MOODS.find(m => m.label === entry.mood)?.emoji || '😊'}
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {entry.mood}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                      title="Delete entry"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Entry Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="glassmorphism dark:glassmorphism-dark rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-4 animate-scaleIn">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Write Journal Entry</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Mood <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {MOODS.map((mood) => (
                    <button
                      type="button"
                      key={mood.label}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formData.mood === mood.label 
                          ? 'bg-gradient-to-r from-indigo-500 to-pink-500 border-indigo-500 text-white shadow-lg' 
                          : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                      }`}
                      onClick={() => setFormData({ ...formData, mood: mood.label })}
                      aria-pressed={formData.mood === mood.label}
                    >
                      <span className="text-2xl mr-2">{mood.emoji}</span>
                      <span className="font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Thoughts <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 resize-none text-gray-900 dark:text-white"
                  placeholder="Write about your day, your feelings, or anything on your mind..."
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.content || !formData.mood}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
