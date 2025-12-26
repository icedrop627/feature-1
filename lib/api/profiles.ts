import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Get user profile by ID
 */
export async function getProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  updates: { name?: string; bio?: string; avatar_url?: string }
): Promise<{ data: Profile | null; error: any }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

/**
 * Upload profile avatar to Supabase Storage
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ data: { path: string; url: string } | null; error: any }> {
  const supabase = createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Math.random()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return {
    data: {
      path: uploadData.path,
      url: publicUrl,
    },
    error: null,
  };
}

/**
 * Delete avatar from storage
 */
export async function deleteAvatar(path: string): Promise<{ error: any }> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from('avatars')
    .remove([path]);

  return { error };
}
