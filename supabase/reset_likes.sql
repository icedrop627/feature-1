-- ============================================
-- Reset all likes and dislikes to 0
-- ============================================

UPDATE public.cities
SET likes = 0, dislikes = 0;

-- ============================================
-- Delete all city reactions
-- ============================================

DELETE FROM public.city_reactions;
