
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
      } else {
        console.log('No profile found, user might be new');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  const checkEarlyAccess = useCallback(async (email: string) => {
    try {
      // We need to handle the case where the column might not exist yet in some environments
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')  // Select all columns instead of specifically requesting email_verified
        .eq('email', email)
        .single();

      if (error) throw error;

      // Check if the email_verified property exists and is true
      return data && data.email_verified === true;
    } catch (error) {
      console.error('Early access check failed:', error);
      return false;
    }
  }, []);

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        setTimeout(() => {
          if (event === 'SIGNED_IN' && newSession?.user) {
            fetchProfile(newSession.user.id);
            setIsLoading(false);
            setLoading(false);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
            setIsLoading(false);
            setLoading(false);
          } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
            console.log('Auth token refreshed');
            setIsLoading(false);
            setLoading(false);
          } else if (event === 'USER_UPDATED' && newSession?.user) {
            fetchProfile(newSession.user.id);
            setIsLoading(false);
            setLoading(false);
          }
        }, 0);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, checkEarlyAccess]);

  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setLoading(true);

      const hasEarlyAccess = await checkEarlyAccess(email);
      const currentDate = new Date();
      const launchDate = new Date('2025-04-20');

      if (currentDate < launchDate && !hasEarlyAccess) {
        throw new Error('Early access is currently closed. Please join the waitlist.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in', {
        description: error.message === 'Early access is currently closed. Please join the waitlist.' 
          ? 'Visit our website to join the waitlist for early access.' 
          : 'Please check your credentials and try again.'
      });
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
      
      setProfile(null);
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
