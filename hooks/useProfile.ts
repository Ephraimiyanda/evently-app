import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No profile found, create one
          await createProfile();
          return;
        }
        throw fetchError;
      }

      const formattedProfile: UserProfile = {
        id: data.id,
        userId: data.user_id,
        fullName: data.full_name || undefined,
        avatarUrl: data.avatar_url || undefined,
        phone: data.phone || undefined,
        bio: data.bio || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setProfile(formattedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          full_name: user.email?.split('@')[0] || '',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newProfile: UserProfile = {
        id: data.id,
        userId: data.user_id,
        fullName: data.full_name || undefined,
        avatarUrl: data.avatar_url || undefined,
        phone: data.phone || undefined,
        bio: data.bio || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    updates: Partial<
      Pick<UserProfile, 'fullName' | 'avatarUrl' | 'phone' | 'bio'>
    >
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const updateData: any = {};
      if (updates.fullName !== undefined)
        updateData.full_name = updates.fullName;
      if (updates.avatarUrl !== undefined)
        updateData.avatar_url = updates.avatarUrl;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.bio !== undefined) updateData.bio = updates.bio;

      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedProfile: UserProfile = {
        id: data.id,
        userId: data.user_id,
        fullName: data.full_name || undefined,
        avatarUrl: data.avatar_url || undefined,
        phone: data.phone || undefined,
        bio: data.bio || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
