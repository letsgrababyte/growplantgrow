'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/SectionHeading';

export default function AdminSignInPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();

      // Sign in with Supabase
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!signInData.user) {
        setError('Sign in failed. Please try again.');
        setLoading(false);
        return;
      }

      // Check if user is an admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', signInData.user.id)
        .single();

      if (adminError || !adminUser) {
        // Sign out the user since they're not an admin
        await supabase.auth.signOut();
        setError('Access denied. This account does not have admin privileges.');
        setLoading(false);
        return;
      }

      // Successfully signed in as admin - redirect to admin dashboard
      // Force full page reload to ensure all components pick up the session
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-botanical-cream-50 py-12 px-4">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-botanical-green-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-botanical-green-700">
            Sign in to access admin features
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-botanical-green-200">
          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-botanical-green-800 font-semibold mb-2">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-botanical-green-300 focus:outline-none focus:ring-2 focus:ring-botanical-green-500 text-botanical-green-900"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-botanical-green-800 font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-10 rounded-md border border-botanical-green-300 focus:outline-none focus:ring-2 focus:ring-botanical-green-500 text-botanical-green-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-botanical-green-600 hover:text-botanical-green-800 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L3 3m14.29 14.29L21 21m0 0l-3.29-3.29M21 21l-3.29-3.29" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-botanical-green-600 text-white rounded-md hover:bg-botanical-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In to Admin Portal'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-botanical-green-200">
            <p className="text-xs text-center text-botanical-green-600">
              Only authorized administrators can access this portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

