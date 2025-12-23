'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Try to get session first
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setEmail(session.user.email || '');
          setLoading(false);
          return;
        }

        // Fallback to getUser
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          setUser(user);
          setEmail(user.email || '');
        } else {
          router.push('/signin');
        }
      } catch (error) {
        console.warn('Supabase not configured.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        setEmail(session.user.email || '');
      } else {
        router.push('/signin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      setMessage('Email update request sent! Please check your new email for confirmation.');
      setMessageType('success');
    } catch (error: any) {
      setMessage(error.message || 'Failed to update email');
      setMessageType('error');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setMessageType('error');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Password updated successfully!');
      setMessageType('success');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage(error.message || 'Failed to update password');
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center text-botanical-green-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Settings"
          subtitle="Manage your account settings and preferences"
        />

        <div className="space-y-6">
          {/* Email Settings */}
          <div className="bg-botanical-cream-100 rounded-lg p-8">
            <h3 className="text-xl font-serif text-botanical-green-800 mb-4">
              Email Settings
            </h3>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-botanical-green-800 font-semibold mb-2">
                  Email Address
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
              <Button type="submit" size="md">
                Update Email
              </Button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="bg-botanical-green-50 rounded-lg p-8">
            <h3 className="text-xl font-serif text-botanical-green-800 mb-4">
              Change Password
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
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
              <Button type="submit" size="md">
                Update Password
              </Button>
            </form>
          </div>

          {/* Notification Settings */}
          <div className="bg-botanical-cream-100 rounded-lg p-8">
            <h3 className="text-xl font-serif text-botanical-green-800 mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-botanical-green-600 rounded focus:ring-botanical-green-500"
                />
                <span className="text-botanical-green-700">Email notifications for new products</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-botanical-green-600 rounded focus:ring-botanical-green-500"
                />
                <span className="text-botanical-green-700">Order updates and shipping notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-botanical-green-600 rounded focus:ring-botanical-green-500"
                />
                <span className="text-botanical-green-700">Marketing emails and promotions</span>
              </label>
            </div>
            <Button size="md" className="mt-4">
              Save Preferences
            </Button>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {message}
            </div>
          )}

          {/* Account Actions */}
          <div className="bg-botanical-green-50 rounded-lg p-8">
            <h3 className="text-xl font-serif text-botanical-green-800 mb-4">
              Account Actions
            </h3>
            <div className="space-y-3">
              <Button href="/account" variant="outline" className="w-full md:w-auto">
                View Account Details
              </Button>
              <Button href="/cart" variant="outline" className="w-full md:w-auto ml-0 md:ml-2">
                View Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

