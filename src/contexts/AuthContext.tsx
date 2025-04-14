
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { setupSessionRefresh, getUserProfile } from '@/services/auth-service';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  loading: boolean; // For backward compatibility
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true); // For backward compatibility

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const profileData = await getUserProfile(userId);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  // Setup session monitoring and refresh
  useEffect(() => {
    if (session) {
      const expiresAt = session.expires_at;
      if (expiresAt) {
        const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
        return setupSessionRefresh(expiresIn);
      }
    }
    return () => {};
  }, [session]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      setLoading(false); // Update both loading states
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        setLoading(false); // Update both loading states
        
        if (event === 'SIGNED_IN' && session?.user) {
          fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Handle successful token refresh
          console.log('Auth token refreshed');
        } else if (event === 'USER_UPDATED' && session?.user) {
          // Refresh profile when user data is updated
          fetchProfile(session.user.id);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      setIsLoading(true);
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Account created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      await fetchProfile(user.id);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
