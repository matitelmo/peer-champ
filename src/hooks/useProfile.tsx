/**
 * User Profile Hook
 * 
 * Manages user profile data, including personal information, preferences,
 * and profile updates. Integrates with the authentication system.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { userService } from '@/lib/database';
import type { User, UpdateUser } from '@/types/database';

// Types
export interface ProfileContextType {
  profile: User | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: UpdateUser) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateEmail: (newEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

// Create the context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Profile Provider Component
interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user, updatePassword: authUpdatePassword, updateProfile: authUpdateProfile } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from database
  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: profileError } = await userService.getById(user.id);

      if (profileError) {
        setError(profileError.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile when user changes
  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Update profile in database
  const updateProfile = async (updates: UpdateUser): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      setError(null);

      // Update in database
      const { data, error: dbError } = await userService.update(user.id, updates);

      if (dbError) {
        return { success: false, error: dbError.message };
      }

      // Update local state
      setProfile(data);

      // Update auth profile if name fields changed
      if (updates.first_name || updates.last_name) {
        await authUpdateProfile({
          firstName: updates.first_name,
          lastName: updates.last_name,
        });
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Refresh profile data
  const refreshProfile = async (): Promise<void> => {
    await fetchProfile();
  };

  // Update password
  const updatePassword = async (
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      setError(null);

      // Verify current password by attempting to sign in
      const { signIn } = useAuth();
      const { error: signInError } = await signIn(user.email!, currentPassword);

      if (signInError) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Update password
      const { error: updateError } = await authUpdatePassword(newPassword);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update email
  const updateEmail = async (
    newEmail: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      setError(null);

      // Verify password
      const { signIn } = useAuth();
      const { error: signInError } = await signIn(user.email!, password);

      if (signInError) {
        return { success: false, error: 'Password is incorrect' };
      }

      // Update email in auth
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Update email in database
      const { error: dbError } = await userService.update(user.id, {
        email: newEmail
      });

      if (dbError) {
        return { success: false, error: dbError.message };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete account
  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      setError(null);

      // Delete user from database
      const { error: dbError } = await userService.delete(user.id);

      if (dbError) {
        return { success: false, error: dbError.message };
      }

      // Sign out user
      const { signOut } = useAuth();
      await signOut();

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value: ProfileContextType = {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
    updatePassword,
    updateEmail,
    deleteAccount,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use profile context
export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export default ProfileProvider;
