'use client';

import { useState, FormEvent, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // No session, redirect to sign in
          router.push('/signin?message=Please sign in to update your password');
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [supabase, router]);

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      
      // Redirect to account page after a moment
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center text-botanical-green-700">Checking session...</div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <SectionHeading
            title="Password Updated"
            subtitle="Your password has been successfully updated"
          />

          <div className="bg-botanical-cream-100 rounded-lg p-8">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-semibold">Password updated successfully!</p>
              <p className="text-sm mt-2">Redirecting to your account...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-md">
        <SectionHeading
          title="Update Password"
          subtitle="Enter your new password"
        />

        <div className="bg-botanical-cream-100 rounded-lg p-8">
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-botanical-green-800 font-semibold mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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
              <p className="text-sm text-botanical-green-600 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-botanical-green-800 font-semibold mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-10 rounded-md border border-botanical-green-300 focus:outline-none focus:ring-2 focus:ring-botanical-green-500 text-botanical-green-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-botanical-green-600 hover:text-botanical-green-800 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
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
              className="w-full px-6 py-3 bg-botanical-green-600 text-botanical-cream-50 rounded-md hover:bg-botanical-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center text-botanical-green-700">Loading...</div>
        </div>
      </div>
    }>
      <UpdatePasswordForm />
    </Suspense>
  );
}

