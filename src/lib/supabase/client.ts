import { createBrowserClient } from '@supabase/ssr';

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if Supabase is properly configured
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'your_supabase_project_url_here' || 
      supabaseAnonKey === 'your_supabase_anon_key_here' ||
      supabaseUrl.includes('placeholder')) {
    console.warn('Supabase environment variables are not set. Authentication features will be disabled.');
    // Create a client with dummy values that won't crash
    if (!supabaseClient) {
      supabaseClient = createBrowserClient(
        'https://placeholder.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'
      );
    }
    return supabaseClient;
  }

  // Always create a fresh client to avoid stale state issues
  // The SSR package handles caching internally
  try {
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    // Fallback to placeholder
    if (!supabaseClient) {
      supabaseClient = createBrowserClient(
        'https://placeholder.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'
      );
    }
    return supabaseClient;
  }
}
