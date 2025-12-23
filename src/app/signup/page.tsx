'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/SectionHeading';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted - handleSignUp called');
    setError('');

    // Validate inputs before setting loading state
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

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
      // Create a fresh Supabase client
      const supabaseClient = createClient();

      // Normalize email (trim and lowercase)
      const normalizedEmail = email.trim().toLowerCase();
      
      console.log('Attempting sign-up for:', normalizedEmail);
      
      const { data, error } = await supabaseClient.auth.signUp({
        email: normalizedEmail,
        password,
      });
      
      console.log('Sign-up response:', { hasData: !!data, hasUser: !!data?.user, hasError: !!error, error: error?.message });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // If user was created successfully
      if (data.user) {
        console.log('User created:', {
          id: data.user.id,
          email: data.user.email,
          hasSession: !!data.session,
          emailConfirmed: data.user.email_confirmed_at,
        });

        // If session is available, user is automatically signed in (email confirmation disabled)
        if (data.session) {
          console.log('Session available, signing in automatically');
          // Wait a moment for session to be fully established
          await new Promise(resolve => setTimeout(resolve, 500));
          // Verify session
          const { data: { user: verifiedUser } } = await supabaseClient.auth.getUser();
          if (verifiedUser) {
            // Force full page reload to ensure all components pick up the session
            window.location.href = '/';
            return;
          }
        }

        // If no session immediately, try to sign in automatically
        // This handles cases where email confirmation is disabled but session wasn't returned
        console.log('No session from signUp, attempting automatic sign-in...');
        
        // Wait a moment for the user to be fully created in the database
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

          console.log('Auto sign-in result:', {
            hasSession: !!signInData?.session,
            hasUser: !!signInData?.user,
            error: signInError?.message,
            errorStatus: signInError?.status,
          });

          if (!signInError && signInData?.session) {
            // Successfully signed in
            console.log('Auto sign-in successful, verifying session...');
            // Wait a moment for session to be fully established
            await new Promise(resolve => setTimeout(resolve, 500));
            // Verify session
            const { data: { user: verifiedUser }, error: verifyError } = await supabaseClient.auth.getUser();
            if (verifiedUser && !verifyError) {
              console.log('Session verified, redirecting...');
              // Force full page reload to ensure all components pick up the session
              window.location.href = '/';
              return;
            } else {
              console.error('Session verification failed:', verifyError);
            }
          }

          // If sign in fails, check the error
          if (signInError) {
            console.log('Auto sign-in failed:', {
              message: signInError.message,
              status: signInError.status,
            });
            
            // Check if it's an email confirmation issue
            const isEmailConfirmationError = signInError.message.includes('Email not confirmed') || 
                                            signInError.message.includes('email_not_confirmed');
            
            if (isEmailConfirmationError) {
              // Email confirmation is required - try waiting a bit and retrying
              // (in case email gets confirmed via webhook or manual confirmation)
              console.log('Email confirmation required, waiting and retrying...');
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              const { data: retrySignIn, error: retryError } = await supabaseClient.auth.signInWithPassword({
                email: normalizedEmail,
                password,
              });
              
              if (!retryError && retrySignIn?.session) {
                console.log('Retry sign-in successful after email confirmation');
                await new Promise(resolve => setTimeout(resolve, 500));
                const { data: { user: verifiedUser } } = await supabaseClient.auth.getUser();
                if (verifiedUser) {
                  window.location.href = '/';
                  return;
                }
              }
              
              // If still failing, email confirmation is required but emails aren't being sent
              setError('');
              setLoading(false);
              sessionStorage.setItem('signup-email', normalizedEmail);
              router.push('/signin?from=signup&email=' + encodeURIComponent(normalizedEmail));
              return;
            }
            
            // For other errors (like invalid credentials), redirect to sign in
            setError('');
            setLoading(false);
            sessionStorage.setItem('signup-email', normalizedEmail);
            router.push('/signin?from=signup&email=' + encodeURIComponent(normalizedEmail));
            return;
          }
        } catch (err: any) {
          console.error('Error during auto sign-in:', err);
          // If sign in also fails, redirect to sign in page
          setError('');
          setLoading(false);
          sessionStorage.setItem('signup-email', normalizedEmail);
          router.push('/signin?from=signup&email=' + encodeURIComponent(normalizedEmail));
        }
      } else {
        setError('Failed to create account. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Unexpected error during sign-up:', err);
      const errorMessage = err?.message || err?.toString() || 'An unexpected error occurred during sign up. Please try again.';
      setError(`Sign-up error: ${errorMessage}. Please check your internet connection and try again.`);
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-md">
        <SectionHeading
          title="Sign Up"
          subtitle="Create your GrowPlantGrow account"
        />

        <div className="bg-botanical-cream-100 rounded-lg p-8">
          <form onSubmit={handleSignUp} className="space-y-6">
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
                Confirm Password
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-botanical-green-700">
              Already have an account?{' '}
              <Link href="/signin" className="text-botanical-green-600 hover:text-botanical-green-800 underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

