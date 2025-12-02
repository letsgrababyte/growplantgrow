'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { User } from '@supabase/supabase-js';
import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { cartCount } = useCart();


  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const supabase = createClient();
    
    const getUser = async () => {
      try {
        // Check if Supabase is properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
          setUser(null);
          setLoading(false);
          return;
        }

        // First try to get session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setLoading(false);
          return;
        }

        // Fallback to getUser
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('Supabase not configured. Authentication disabled.', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.warn('Error signing out:', error);
    }
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-botanical-green-800 text-botanical-cream-50 shadow-md sticky top-0 z-50 relative">
      {/* Top Bar */}
      <div className="border-b border-botanical-green-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <Link href="/" className="text-2xl md:text-3xl font-serif font-bold hover:text-botanical-cream-200 transition-colors flex-shrink-0">
              GrowPlantGrow
            </Link>

            {/* Center Section - Etsy Button and Social Icons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Etsy Shop Button */}
              <a
                href="https://etsy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-botanical-cream-300 rounded-md hover:bg-botanical-green-700 transition-colors text-sm"
              >
                Shop Our Etsy Store
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* Social Icons - Moved left, closer to Etsy button */}
              <div className="flex items-center gap-2">
                {/* Pinterest - Official "P" badge icon */}
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-botanical-green-700 rounded-full transition-colors"
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.619 11.174-.105-.949-.2-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                </a>
                {/* Instagram - Official camera glyph icon */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-botanical-green-700 rounded-full transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* Facebook - Official lowercase "f" icon */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-botanical-green-700 rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* YouTube - Official play button icon */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-botanical-green-700 rounded-full transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Auth Icons - Sign In/Sign Up (only shown when not logged in) */}
              {loading ? (
                <div className="w-8 h-8 animate-pulse bg-botanical-green-700 rounded-full"></div>
              ) : !user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/signin"
                    className="px-3 py-1 text-sm hover:bg-botanical-green-700 rounded-md transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-1 text-sm bg-botanical-cream-500 text-botanical-green-900 rounded-md hover:bg-botanical-cream-600 transition-colors hidden md:block"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : null}

              {/* Shopping Cart */}
              <Link
                href="/cart"
                className="relative p-2 hover:bg-botanical-green-700 rounded-md transition-colors"
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile Icon - Always visible, between Cart and Hamburger */}
              {loading ? (
                <div className="p-2 flex items-center justify-center">
                  <svg className="w-6 h-6 text-botanical-cream-50 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              ) : user ? (
                <ProfileDropdown user={user} />
              ) : (
                <Link
                  href="/signin"
                  className="p-2 hover:bg-botanical-green-700 rounded-md transition-colors flex items-center justify-center"
                  aria-label="Sign in"
                  title="Sign in to your account"
                >
                  <svg className="w-6 h-6 text-botanical-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              {/* Hamburger Menu Button - Always visible in upper right */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-botanical-green-700 rounded-md transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar - Centered Below Top Bar */}
      <div className="bg-botanical-green-700 py-3">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything..."
              className="flex-1 px-4 py-2 rounded-md text-botanical-green-900 placeholder-botanical-green-500 focus:outline-none focus:ring-2 focus:ring-botanical-cream-300"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-botanical-cream-500 text-botanical-green-900 rounded-md hover:bg-botanical-cream-600 transition-colors font-medium"
              aria-label="Submit search"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Hamburger Menu Dropdown - Always visible when open */}
      {mobileMenuOpen && (
        <div className="absolute top-full right-4 mt-2 bg-botanical-green-800 border border-botanical-green-700 rounded-lg shadow-xl z-50 min-w-[250px]">
          <nav className="flex flex-col py-2">
            {/* Account Section */}
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm flex items-center gap-2 text-left w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
                <div className="border-t border-botanical-green-700 my-1"></div>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm"
                >
                  Sign Up
                </Link>
                <div className="border-t border-botanical-green-700 my-1"></div>
              </>
            )}
            
            <Link
              href="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/policies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm"
            >
              Policies
            </Link>
            <Link
              href="/return-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm"
            >
              Return Policy
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm"
            >
              Contact
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm"
            >
              FAQ
            </Link>
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm"
            >
              Learn
            </Link>
            <div className="border-t border-botanical-green-700 my-1"></div>
            <a
              href="https://etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-botanical-green-700 transition-colors text-sm flex items-center gap-2"
            >
              Shop Our Etsy Store
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
