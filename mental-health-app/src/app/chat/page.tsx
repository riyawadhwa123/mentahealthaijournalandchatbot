'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Chatbot from '@/components/Chatbot';
import { getToken } from '@/lib/auth';

export default function ChatPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('[ChatPage] useEffect: Starting token retrieval');
    
    // Must run after hydration - use Promise to ensure DOM is ready
    const checkAuth = async () => {
      try {
        // Small delay to ensure localStorage is accessible after hydration
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const storedToken = getToken();
        console.log('[ChatPage] useEffect: Token retrieved from getToken():', storedToken ? '✓ exists' : '✗ null');
        
        if (!storedToken) {
          console.log('[ChatPage] useEffect: No token found, redirecting to login');
          setError('Session expired. Please log in again.');
          setIsLoading(false);
          // Use router.push with a small delay
          setTimeout(() => router.push('/login'), 200);
          return;
        }

        console.log('[ChatPage] useEffect: ✓ Token found, setting state');
        setToken(storedToken);
        setError(null);
      } catch (err) {
        console.error('[ChatPage] useEffect: Error checking auth:', err);
        setError('Failed to load authentication');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen soft-gradient flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.1s' }}></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen soft-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen soft-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="h-[calc(100vh-8rem)]">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}
