'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import AdminBar from './AdminBar';

interface AdminModeContextType {
  isAdmin: boolean;
  adminRole: string | null;
  adminUser: any | null;
  loading: boolean;
}

const AdminModeContext = createContext<AdminModeContextType>({
  isAdmin: false,
  adminRole: null,
  adminUser: null,
  loading: true,
});

export function useAdminMode() {
  return useContext(AdminModeContext);
}

interface AdminModeProviderProps {
  children: ReactNode;
}

export function AdminModeProvider({ children }: AdminModeProviderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isSupabaseConfigured = supabaseUrl && 
                                  supabaseKey && 
                                  !supabaseUrl.includes('placeholder') && 
                                  supabaseKey !== 'placeholder-key';

    // Skip if Supabase is not configured
    if (!isSupabaseConfigured) {
      setIsAdmin(false);
      setAdminRole(null);
      setAdminUser(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    let subscription: any = null;

    const checkAdminStatus = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        
        const userPromise = supabase.auth.getUser();
        const { data: { user: currentUser } } = await Promise.race([userPromise, timeoutPromise]) as any;
        
        if (!mounted) return;
        
        setUser(currentUser || null);

        if (!currentUser) {
          setIsAdmin(false);
          setAdminRole(null);
          setAdminUser(null);
          setLoading(false);
          return;
        }

        // Check if user is an admin with timeout
        const adminQueryPromise = supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        const { data: adminData, error } = await Promise.race([adminQueryPromise, timeoutPromise]) as any;

        if (!mounted) return;

        if (adminData && !error) {
          setIsAdmin(true);
          setAdminRole(adminData.role);
          setAdminUser(adminData);
        } else {
          setIsAdmin(false);
          setAdminRole(null);
          setAdminUser(null);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setAdminRole(null);
          setAdminUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAdminStatus();

    // Listen for auth changes
    try {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        if (mounted) {
          if (session?.user) {
            await checkAdminStatus();
          } else {
            setIsAdmin(false);
            setAdminRole(null);
            setAdminUser(null);
            setUser(null);
          }
        }
      });
      subscription = sub;
    } catch (error) {
      console.warn('Failed to set up auth state listener:', error);
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AdminModeContext.Provider value={{ isAdmin, adminRole, adminUser, loading }}>
      {children}
      {isAdmin && adminRole && (
        <AdminBar user={user} adminRole={adminRole} />
      )}
    </AdminModeContext.Provider>
  );
}

