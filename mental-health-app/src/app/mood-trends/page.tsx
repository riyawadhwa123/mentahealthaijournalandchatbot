"use client";

import MoodTrendsChart from '@/components/MoodTrendsChart';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';
import API_BASE_URL from '@/lib/api';
import { TrendingUp, Sparkles, Calendar, Target, Award, Activity, Trash2 } from 'lucide-react';

interface MoodEntry {
  _id: string;
  mood: string;
  moodScore: number;
  createdAt: string;
  description?: string;
}

function getStreak(entries: MoodEntry[]): number {
  if (!entries.length) return 0;
  let streak = 1;
  let maxStreak = 1;
  let prevDate = new Date(entries[0].createdAt);
  for (let i = 1; i < entries.length; i++) {
    const currDate = new Date(entries[i].createdAt);
    const diff = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 1.5 && diff >= 0.5) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 1;
    }
    prevDate = currDate;
  }
  return maxStreak;
}

export default function MoodTrendsPage() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMoods = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/mood`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setMoods(Array.isArray(result.entries) ? result.entries : []);
      } else {
        setMoods([]);
      }
    } catch (error) {
      setMoods([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mood entry? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/mood/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the deleted entry from the local state
        setMoods(prevMoods => prevMoods.filter(mood => mood._id !== id));
      } else {
        alert('Failed to delete mood entry. Please try again.');
      }
    } catch (error) {
      alert('Failed to delete mood entry. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Analytics
  const last7 = moods.filter(m => new Date(m.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const last30 = moods.filter(m => new Date(m.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const avg7 = last7.length ? (last7.reduce((a, b) => a + b.moodScore, 0) / last7.length).toFixed(2) : 'N/A';
  const avg30 = last30.length ? (last30.reduce((a, b) => a + b.moodScore, 0) / last30.length).toFixed(2) : 'N/A';
  const best = moods.length ? moods.reduce((a, b) => (a.moodScore > b.moodScore ? a : b)) : null;
  const worst = moods.length ? moods.reduce((a, b) => (a.moodScore < b.moodScore ? a : b)) : null;
  const streak = getStreak([...moods].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  if (isLoading) {
    return (
      <div className="min-h-screen soft-gradient flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.1s' }}></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading your mood trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen soft-gradient">
      <div className="container mx-auto px-4 py-12 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-800 to-violet-800 bg-clip-text text-transparent">
              Mood Trends
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your mood over time and spot patterns in your emotional well-being
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="glassmorphism rounded-3xl p-8 flex flex-col items-center group hover:scale-105 transition-all duration-300 animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
              <Target className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-600 mb-2">Avg. Mood (7d)</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{avg7}</span>
          </div>
          
          <div className="glassmorphism rounded-3xl p-8 flex flex-col items-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-600 mb-2">Avg. Mood (30d)</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-800 bg-clip-text text-transparent">{avg30}</span>
          </div>
          
          <div className="glassmorphism rounded-3xl p-8 flex flex-col items-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
              <Award className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-600 mb-2">Best Day</span>
            {best ? (
              <div className="text-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">
                  {best.moodScore} / 5
                </span>
                <p className="text-lg font-semibold text-gray-900 mt-1">{best.mood}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date(best.createdAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <span className="text-gray-400 text-xl">N/A</span>
            )}
          </div>
          
          <div className="glassmorphism rounded-3xl p-8 flex flex-col items-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-600 mb-2">Worst Day</span>
            {worst ? (
              <div className="text-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-800 bg-clip-text text-transparent">
                  {worst.moodScore} / 5
                </span>
                <p className="text-lg font-semibold text-gray-900 mt-1">{worst.mood}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date(worst.createdAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <span className="text-gray-400 text-xl">N/A</span>
            )}
          </div>
          
          <div className="glassmorphism rounded-3xl p-8 flex flex-col items-center group hover:scale-105 transition-all duration-300 animate-slide-up md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-600 mb-2">Mood Logging Streak</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent">
              {streak} {streak === 1 ? 'day' : 'days'}
            </span>
            <p className="text-sm text-gray-500 mt-2">Keep up the great work!</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <MoodTrendsChart />
        </div>

        {/* Mood Entries Table */}
        <div className="mt-12 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center space-x-2">
            <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Mood Entry History</span>
          </h2>
          {moods.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No mood entries yet. Start logging your mood to see your history here!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl shadow-lg glassmorphism dark:glassmorphism-dark">
              <table className="min-w-full text-left text-gray-800 dark:text-gray-100">
                <thead>
                  <tr className="bg-indigo-50 dark:bg-indigo-900/40">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Mood</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {moods.map((entry) => (
                    <tr key={entry._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                        <span className="text-2xl">
                          {(() => {
                            switch (entry.mood) {
                              case 'Happy': return '😊';
                              case 'Excited': return '🤩';
                              case 'Calm': return '😌';
                              case 'Tired': return '😴';
                              case 'Sad': return '😢';
                              case 'Angry': return '😠';
                              case 'Anxious': return '😰';
                              default: return '🙂';
                            }
                          })()}
                        </span>
                        <span>{entry.mood}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.moodScore} / 5</td>
                      <td className="px-6 py-4 whitespace-pre-line max-w-xs truncate">{entry.description || <span className="text-gray-400 italic">—</span>}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(entry._id)}
                          disabled={deletingId === entry._id}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {deletingId === entry._id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          ) : (
                            <Trash2 className="w-4 h-4 mr-1" />
                          )}
                          {deletingId === entry._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 