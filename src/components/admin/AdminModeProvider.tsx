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
    
    const checkAdminStatus = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (!currentUser) {
          setIsAdmin(false);
          setAdminRole(null);
          setAdminUser(null);
          setLoading(false);
          return;
        }

        // Check if user is an admin
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

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
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setAdminRole(null);
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        await checkAdminStatus();
      } else {
        setIsAdmin(false);
        setAdminRole(null);
        setAdminUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
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

