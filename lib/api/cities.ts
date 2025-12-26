import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { FilterState, SortOption } from '@/lib/types';
import { Database } from '@/lib/database.types';

type City = Database['public']['Tables']['cities']['Row'];

/**
 * Get all cities with optional filters and sorting
 */
export async function getCities(
  filters?: FilterState,
  sortBy?: SortOption
): Promise<{ data: City[] | null; error: any }> {
  const supabase = createClient();

  let query = supabase
    .from('cities')
    .select('*');

  // Apply filters
  if (filters) {
    // Budget filter
    if (filters.budget && filters.budget !== '전체') {
      query = query.eq('budget', filters.budget);
    }

    // Region filter
    if (filters.regions && filters.regions.length > 0) {
      query = query.in('region', filters.regions);
    }

    // Environment filter (array contains)
    if (filters.environment && filters.environment.length > 0) {
      query = query.overlaps('environment', filters.environment);
    }

    // Best season filter (array contains)
    if (filters.bestSeason && filters.bestSeason.length > 0) {
      query = query.overlaps('best_season', filters.bestSeason);
    }

    // Search query
    if (filters.searchQuery) {
      query = query.or(`name_ko.ilike.%${filters.searchQuery}%,name_en.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }
  }

  // Apply sorting
  if (sortBy === 'likes') {
    query = query.order('likes', { ascending: false });
  } else if (sortBy === 'cost_low') {
    query = query.order('monthly_cost', { ascending: true, nullsFirst: false });
  } else if (sortBy === 'cost_high') {
    query = query.order('monthly_cost', { ascending: false, nullsFirst: false });
  } else {
    // Default sorting by created_at
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  return { data, error };
}

/**
 * Get a single city by ID
 */
export async function getCityById(cityId: string): Promise<{ data: City | null; error: any }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', cityId)
    .single();

  return { data, error };
}

/**
 * Get user's reaction to a city
 */
export async function getUserCityReaction(
  cityId: string,
  userId: string
): Promise<{ data: 'like' | 'dislike' | null; error: any }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('city_reactions')
    .select('reaction_type')
    .eq('city_id', cityId)
    .eq('user_id', userId)
    .maybeSingle();

  return { data: data?.reaction_type ?? null, error };
}

/**
 * Toggle city reaction (like/dislike)
 */
export async function toggleCityReaction(
  cityId: string,
  userId: string,
  reactionType: 'like' | 'dislike'
): Promise<{ data: any; error: any }> {
  const supabase = createClient();

  // Check if user already has a reaction
  const { data: existing, error: fetchError } = await supabase
    .from('city_reactions')
    .select('*')
    .eq('city_id', cityId)
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) {
    return { data: null, error: fetchError };
  }

  // If same reaction exists, remove it (toggle off)
  if (existing && existing.reaction_type === reactionType) {
    const { error: deleteError } = await supabase
      .from('city_reactions')
      .delete()
      .eq('id', existing.id);

    return { data: null, error: deleteError };
  }

  // If different reaction exists, update it
  if (existing && existing.reaction_type !== reactionType) {
    const { data, error } = await supabase
      .from('city_reactions')
      .update({ reaction_type: reactionType })
      .eq('id', existing.id)
      .select()
      .single();

    return { data, error };
  }

  // If no reaction exists, create new one
  const { data, error } = await supabase
    .from('city_reactions')
    .insert({
      city_id: cityId,
      user_id: userId,
      reaction_type: reactionType,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get cities on the server side (for SSR)
 */
export async function getCitiesServer(
  filters?: FilterState,
  sortBy?: SortOption
): Promise<{ data: City[] | null; error: any }> {
  const supabase = await createServerClient();

  let query = supabase
    .from('cities')
    .select('*');

  // Apply filters
  if (filters) {
    if (filters.budget && filters.budget !== '전체') {
      query = query.eq('budget', filters.budget);
    }

    if (filters.regions && filters.regions.length > 0) {
      query = query.in('region', filters.regions);
    }

    if (filters.environment && filters.environment.length > 0) {
      query = query.overlaps('environment', filters.environment);
    }

    if (filters.bestSeason && filters.bestSeason.length > 0) {
      query = query.overlaps('best_season', filters.bestSeason);
    }

    if (filters.searchQuery) {
      query = query.or(`name_ko.ilike.%${filters.searchQuery}%,name_en.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }
  }

  // Apply sorting
  if (sortBy === 'likes') {
    query = query.order('likes', { ascending: false });
  } else if (sortBy === 'cost_low') {
    query = query.order('monthly_cost', { ascending: true, nullsFirst: false });
  } else if (sortBy === 'cost_high') {
    query = query.order('monthly_cost', { ascending: false, nullsFirst: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  return { data, error };
}
