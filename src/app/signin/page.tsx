'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/SectionHeading';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if redirected from signup
    const fromSignup = searchParams.get('from') === 'signup';
    const emailParam = searchParams.get('email');
    
    if (fromSignup) {
      setSuccessMessage('Account created successfully! Please sign in with your email and password.');
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      } else {
        // Try to get from sessionStorage
        const savedEmail = sessionStorage.getItem('signup-email');
        if (savedEmail) {
          setEmail(savedEmail);
          sessionStorage.removeItem('signup-email');
        }
      }
    }
  }, [searchParams]);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted - handleSignIn called');
    setError('');
    setLoading(true);

    try {
      // Validate inputs first
      if (!email.trim()) {
        setError('Please enter your email address.');
        setLoading(false);
        return;
      }

      if (!password) {
        setError('Please enter your password.');
        setLoading(false);
        return;
      }

      // Create a fresh Supabase client
      const supabaseClient = createClient();
      
      // Normalize email (trim and lowercase)
      const normalizedEmail = email.trim().toLowerCase();
      
      console.log('Attempting sign-in for:', normalizedEmail);
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });
      
      console.log('Sign-in response:', { hasData: !!data, hasError: !!error, error: error?.message });

      if (error) {
        // Provide more helpful error messages
        console.error('Sign-in error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          setError(
            'Please confirm your email address before signing in. ' +
            'If you didn\'t receive an email, you may need to disable email confirmation in Supabase Dashboard > Authentication > Settings.'
          );
        } else if (error.message.includes('Invalid login credentials') || 
                   error.message.includes('invalid_credentials') ||
                   error.message.includes('Invalid email or password')) {
          setError(
            'Invalid email or password. Please check your credentials and try again.\n\n' +
            'Tips:\n' +
            '• Make sure your email is correct (check for typos)\n' +
            '• Verify your password is correct\n' +
            '• Try using the "Forgot your password?" link to reset your password'
          );
        } else {
          // Show the actual error message for debugging
          setError(`Sign-in failed: ${error.message} (Error code: ${error.status || 'unknown'})`);
        }
        setLoading(false);
        return;
      }

      // Verify we have a session
      if (!data.session) {
        console.error('No session returned from signInWithPassword');
        setError('Sign-in succeeded but no session was created. Please try again.');
        setLoading(false);
        return;
      }

      console.log('Sign-in successful, session created:', {
        user: data.session.user.email,
        expiresAt: data.session.expires_at,
      });

      // Verify session is valid by checking user
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError || !user) {
        console.error('Failed to verify user after sign-in:', userError);
        setError('Sign-in succeeded but could not verify your account. Please try again.');
        setLoading(false);
        return;
      }

      // Session is valid, redirect
      // Use window.location for a full page reload to ensure all components pick up the session
      window.location.href = '/';
    } catch (err: any) {
      console.error('Unexpected error during sign-in:', err);
      const errorMessage = err?.message || err?.toString() || 'An unexpected error occurred during sign in. Please try again.';
      setError(`Sign-in error: ${errorMessage}. Please check your internet connection and try again.`);
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-md">
        <SectionHeading
          title="Sign In"
          subtitle="Welcome back to GrowPlantGrow"
        />

        <div className="bg-botanical-cream-100 rounded-lg p-8">
          <form onSubmit={handleSignIn} className="space-y-6">
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-botanical-green-800 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-botanical-green-300 focus:outline-none focus:ring-2 focus:ring-botanical-green-500 text-botanical-green-900"
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
              className="w-full px-6 py-3 bg-botanical-green-600 text-botanical-cream-50 rounded-md hover:bg-botanical-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-botanical-green-700">
              Don't have an account?{' '}
              <Link href="/signup" className="text-botanical-green-600 hover:text-botanical-green-800 underline">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-botanical-green-600">
              <Link href="/reset-password" className="hover:text-botanical-green-800 underline">
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center text-botanical-green-700">Loading...</div>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
