'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ProfileDropdownProps {
  user: User;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  
  // Get favorites count
  const { favorites } = useFavorites();
  const favoritesCount = favorites?.length || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.warn('Error signing out:', error);
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (user.email) {
      const emailParts = user.email.split('@')[0];
      const parts = emailParts.split('.');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return emailParts.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Get first letter of email
  const getFirstLetter = () => {
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-botanical-green-700 rounded-md transition-colors relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-botanical-cream-300"
        aria-label="Profile menu"
        aria-expanded={isOpen}
        title={user.email || 'Profile'}
      >
        {/* Profile Icon SVG */}
        <svg 
          className="w-6 h-6 text-botanical-cream-50" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-botanical-cream-50 rounded-lg shadow-xl border border-botanical-green-200 z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="px-4 py-3 bg-botanical-green-800 text-botanical-cream-50 border-b border-botanical-green-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-botanical-cream-500 text-botanical-green-900 flex items-center justify-center font-semibold">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user.email}</p>
                <p className="text-xs text-botanical-cream-200 truncate">Account</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-botanical-green-100 transition-colors text-botanical-green-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>My Account</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-botanical-green-100 transition-colors text-botanical-green-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-botanical-green-100 transition-colors text-botanical-green-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Shopping Cart</span>
            </Link>

            <Link
              href="/account/favorites"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-botanical-green-100 transition-colors text-botanical-green-800"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>My Favorites</span>
              {favoritesCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-botanical-green-100 transition-colors text-botanical-green-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Order History</span>
            </Link>

            <Link
              href="/account/downloads"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-botanical-green-100 transition-colors text-botanical-green-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Downloads</span>
            </Link>

            <div className="border-t border-botanical-green-200 my-1"></div>

            <div className="border-t border-botanical-green-200 my-1"></div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600 text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

