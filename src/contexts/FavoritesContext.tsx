'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productId: string, requireAuth?: boolean) => Promise<boolean>;
  isFavorite: (productId: string) => boolean;
  user: User | null;
  showSignInPrompt: boolean;
  setShowSignInPrompt: (show: boolean) => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Check if Supabase is properly configured
  const isSupabaseConfigured = useCallback(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return supabaseUrl && 
           supabaseKey && 
           !supabaseUrl.includes('placeholder') && 
           supabaseKey !== 'placeholder-key';
  }, []);

  // Load favorites from Supabase
  const loadFavoritesFromSupabase = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('product_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading favorites from Supabase:', error);
        return [];
      }

      return data?.map((item: any) => item.product_id) || [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }, [supabase, isSupabaseConfigured]);

  // Sync localStorage favorites to Supabase when user logs in
  const syncLocalFavoritesToSupabase = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      const localFavorites = localStorage.getItem('gpg-favorites');
      if (!localFavorites) return;

      const localFavArray = JSON.parse(localFavorites) as string[];
      if (localFavArray.length === 0) return;

      // Get existing favorites from Supabase
      const existingFavorites = await loadFavoritesFromSupabase(userId);
      const existingSet = new Set(existingFavorites);

      // Add local favorites that don't exist in Supabase
      const toAdd = localFavArray.filter((id) => !existingSet.has(id));
      
      if (toAdd.length > 0) {
        const { error } = await supabase
          .from('user_favorites')
          .insert(
            toAdd.map((productId) => ({
              user_id: userId,
              product_id: productId,
            }))
          );

        if (error) {
          console.error('Error syncing local favorites to Supabase:', error);
        }
      }
    } catch (error) {
      console.error('Error syncing favorites:', error);
    }
  }, [supabase, loadFavoritesFromSupabase, isSupabaseConfigured]);

  // Load favorites when user changes
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      
      if (user) {
        // User is logged in - load from Supabase
        const supabaseFavorites = await loadFavoritesFromSupabase(user.id);
        
        // Sync local favorites to Supabase (merge)
        await syncLocalFavoritesToSupabase(user.id);
        
        // Reload after sync to get merged list
        const mergedFavorites = await loadFavoritesFromSupabase(user.id);
        setFavorites(mergedFavorites);
        
        // Update localStorage with merged favorites
        localStorage.setItem('gpg-favorites', JSON.stringify(mergedFavorites));
      } else {
        // User is not logged in - load from localStorage
        const savedFavorites = localStorage.getItem('gpg-favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        } else {
          setFavorites([]);
        }
      }
      
      setLoading(false);
    };

    loadFavorites();
  }, [user, loadFavoritesFromSupabase, syncLocalFavoritesToSupabase]);

  // Get user and listen for auth changes
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        setUser(null);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Save to localStorage whenever favorites change (for offline support)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('gpg-favorites', JSON.stringify(favorites));
    }
  }, [favorites, loading]);

  const toggleFavorite = async (productId: string, requireAuth: boolean = true): Promise<boolean> => {
    // If authentication is required and user is not signed in, show prompt
    if (requireAuth && !user) {
      setShowSignInPrompt(true);
      return false;
    }

    const isCurrentlyFavorite = favorites.includes(productId);
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    // Optimistically update UI
    setFavorites(newFavorites);

    // If user is logged in and Supabase is configured, sync with Supabase
    if (user && isSupabaseConfigured()) {
      try {
        if (isCurrentlyFavorite) {
          // Remove from Supabase
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

          if (error) {
            console.error('Error removing favorite from Supabase:', error);
            // Revert on error
            setFavorites(favorites);
            return false;
          }
        } else {
          // Add to Supabase
          const { error } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              product_id: productId,
            });

          if (error) {
            console.error('Error adding favorite to Supabase:', error);
            // Revert on error
            setFavorites(favorites);
            return false;
          }
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        // Revert on error
        setFavorites(favorites);
        return false;
      }
    }

    return true;
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      toggleFavorite, 
      isFavorite, 
      user,
      showSignInPrompt,
      setShowSignInPrompt,
      loading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

