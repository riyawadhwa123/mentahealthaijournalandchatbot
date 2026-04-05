"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getToken } from '@/lib/auth';
import { TrendingUp, Activity } from 'lucide-react';
import API_BASE_URL from '@/lib/api';

interface MoodEntry {
  _id: string;
  mood: string;
  moodScore: number;
  createdAt: string;
}

export default function MoodTrendsChart() {
  const [data, setData] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
          setData(Array.isArray(result.entries) ? result.entries.reverse() : []);
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="glassmorphism rounded-3xl p-8 animate-fade-in">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Mood Trends</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-violet-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.1s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="glassmorphism rounded-3xl p-8 animate-fade-in">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Mood Trends</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No mood data to display yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Start logging your moods to see beautiful trends and patterns in your emotional well-being.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-3xl p-8 animate-fade-in">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Mood Trends</h2>
      </div>
      
      <div className="bg-gradient-to-br from-white/50 to-purple-50/30 rounded-2xl p-6 border border-white/20">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
            <XAxis
              dataKey="createdAt"
              tickFormatter={date => new Date(date).toLocaleDateString()}
              minTickGap={30}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              domain={[1, 5]} 
              ticks={[1, 2, 3, 4, 5]} 
              allowDecimals={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              labelFormatter={date => new Date(date).toLocaleString()}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="moodScore" 
              stroke="url(#gradient)" 
              strokeWidth={4} 
              dot={{ 
                r: 6, 
                fill: '#8B5CF6',
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
              activeDot={{ 
                r: 8, 
                fill: '#7C3AED',
                stroke: '#FFFFFF',
                strokeWidth: 3,
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Track your emotional journey over time. Higher scores indicate better moods.
        </p>
      </div>
    </div>
  );
} 