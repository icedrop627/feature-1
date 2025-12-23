-- Create city_reactions table for likes/dislikes
CREATE TABLE IF NOT EXISTS public.city_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(city_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_city_reactions_city_id ON public.city_reactions(city_id);
CREATE INDEX IF NOT EXISTS idx_city_reactions_user_id ON public.city_reactions(user_id);

-- Function to update city likes/dislikes count
CREATE OR REPLACE FUNCTION public.update_city_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.reaction_type = 'like' THEN
      UPDATE public.cities SET likes = likes + 1 WHERE id = NEW.city_id;
    ELSIF NEW.reaction_type = 'dislike' THEN
      UPDATE public.cities SET dislikes = dislikes + 1 WHERE id = NEW.city_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE public.cities SET likes = likes - 1 WHERE id = OLD.city_id;
    ELSIF OLD.reaction_type = 'dislike' THEN
      UPDATE public.cities SET dislikes = dislikes - 1 WHERE id = OLD.city_id;
    END IF;
    IF NEW.reaction_type = 'like' THEN
      UPDATE public.cities SET likes = likes + 1 WHERE id = NEW.city_id;
    ELSIF NEW.reaction_type = 'dislike' THEN
      UPDATE public.cities SET dislikes = dislikes + 1 WHERE id = NEW.city_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE public.cities SET likes = likes - 1 WHERE id = OLD.city_id;
    ELSIF OLD.reaction_type = 'dislike' THEN
      UPDATE public.cities SET dislikes = dislikes - 1 WHERE id = OLD.city_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER city_reactions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.city_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_city_reaction_counts();
