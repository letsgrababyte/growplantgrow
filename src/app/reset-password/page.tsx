'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import SectionHeading from '@/components/SectionHeading';

function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <SectionHeading
            title="Check Your Email"
            subtitle="Password reset instructions sent"
          />

          <div className="bg-botanical-cream-100 rounded-lg p-8">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-semibold mb-2">Password reset email sent!</p>
              <p className="text-sm">
                We've sent password reset instructions to <strong>{email}</strong>.
                Please check your email and follow the link to reset your password.
              </p>
            </div>

            <div className="text-center space-y-3">
              <Link
                href="/signin"
                className="inline-block text-botanical-green-600 hover:text-botanical-green-800 underline"
              >
                Back to Sign In
              </Link>
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
          title="Reset Password"
          subtitle="Enter your email to receive reset instructions"
        />

        <div className="bg-botanical-cream-100 rounded-lg p-8">
          <form onSubmit={handleResetPassword} className="space-y-6">
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
                placeholder="your.email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-botanical-green-600 text-botanical-cream-50 rounded-md hover:bg-botanical-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-botanical-green-700">
              Remember your password?{' '}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center text-botanical-green-700">Loading...</div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

