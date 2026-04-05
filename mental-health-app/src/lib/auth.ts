// Authentication utilities - FIXED for proper SSR handling

export const getToken = (): string | null => {
  try {
    if (typeof window === 'undefined') {
      console.log('[auth.ts] getToken: Running on server, returning null');
      return null;
    }
    const token = localStorage.getItem('token');
    console.log('[auth.ts] getToken: Retrieved token from localStorage:', token ? '✓ exists' : '✗ null');
    return token;
  } catch (error) {
    console.error('[auth.ts] getToken: Error accessing localStorage:', error);
    return null;
  }
};

export const setToken = (token: string | undefined): void => {
  try {
    if (typeof window === 'undefined') {
      console.log('[auth.ts] setToken: Running on server, cannot set token');
      return;
    }
    
    // CRITICAL FIX: Don't store undefined or 'undefined' string
    if (!token || token === 'undefined' || token.length === 0) {
      console.error('[auth.ts] setToken: ✗ CRITICAL - Token is invalid:', token);
      console.error('[auth.ts] setToken: Refusing to store invalid token');
      localStorage.removeItem('token');
      return;
    }
    
    console.log('[auth.ts] setToken: Storing token in localStorage:', token.substring(0, 20) + '...');
    localStorage.setItem('token', token);
    
    // Verify it was stored
    const verify = localStorage.getItem('token');
    console.log('[auth.ts] setToken: Verification - token stored successfully:', !!verify);
  } catch (error) {
    console.error('[auth.ts] setToken: Error storing token:', error);
  }
};

export const removeToken = (): void => {
  try {
    if (typeof window === 'undefined') return;
    console.log('[auth.ts] removeToken: Clearing token from localStorage');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('[auth.ts] removeToken: Error removing token:', error);
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

// API request helper with authentication
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  console.log(`[auth.ts] apiRequest: Calling ${url}, token present: ${!!token}`);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[auth.ts] apiRequest: Added Authorization header');
  } else {
    console.warn('[auth.ts] apiRequest: No token available - request may fail with 401');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}; 