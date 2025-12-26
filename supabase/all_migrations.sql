-- ============================================
-- K-Nomad Database Setup - All Migrations
-- Execute this file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Create cities table
-- ============================================
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  monthly_cost INTEGER,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  budget TEXT CHECK (budget IN ('100만원 이하', '100~200만원', '200만원 이상')),
  region TEXT CHECK (region IN ('수도권', '경상도', '전라도', '강원도', '제주도', '충청도')),
  environment TEXT[],
  best_season TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_cities_region ON public.cities(region);
CREATE INDEX IF NOT EXISTS idx_cities_budget ON public.cities(budget);
CREATE INDEX IF NOT EXISTS idx_cities_likes ON public.cities(likes DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_cities_updated_at
  BEFORE UPDATE ON public.cities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 2. Create profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger for profiles
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. Create reviews table
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_city_id ON public.reviews(city_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Create updated_at trigger for reviews
CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 4. Create city_reactions table
-- ============================================
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

-- ============================================
-- 5. Enable Row Level Security
-- ============================================
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_reactions ENABLE ROW LEVEL SECURITY;

-- Cities table policies (public read, admin write)
CREATE POLICY "Anyone can view cities"
  ON public.cities FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert cities"
  ON public.cities FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update cities"
  ON public.cities FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete cities"
  ON public.cities FOR DELETE
  USING (auth.role() = 'authenticated');

-- Profiles table policies (users can manage their own profile)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Reviews table policies
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- City reactions table policies
CREATE POLICY "Anyone can view reactions"
  ON public.city_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reactions"
  ON public.city_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions"
  ON public.city_reactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON public.city_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 6. Create profile trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. Seed initial city data
-- ============================================
INSERT INTO public.cities (name_ko, name_en, description, cover_image, monthly_cost, likes, dislikes, budget, region, environment, best_season) VALUES
(
  '서울',
  'Seoul',
  '대한민국의 수도이자 최대 도시. 무한한 기회와 다양한 문화가 공존하는 곳입니다.',
  'https://images.unsplash.com/photo-1517154421773-0529f29ea451',
  2445000,
  342,
  89,
  '200만원 이상',
  '수도권',
  ARRAY['도심선호', '카페작업', '코워킹 필수'],
  ARRAY['봄', '가을']
),
(
  '부산',
  'Busan',
  '아름다운 해안선과 활기찬 문화가 어우러진 대한민국 제2의 도시입니다.',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0',
  2100000,
  298,
  56,
  '200만원 이상',
  '경상도',
  ARRAY['도심선호', '카페작업', '자연친화'],
  ARRAY['여름', '가을']
),
(
  '제주',
  'Jeju',
  '청정 자연과 독특한 문화가 살아있는 섬. 디지털 노마드의 성지입니다.',
  'https://images.unsplash.com/photo-1610375461246-83df859d849d',
  950000,
  412,
  34,
  '100만원 이하',
  '제주도',
  ARRAY['자연친화', '카페작업'],
  ARRAY['봄', '여름', '가을']
),
(
  '강릉',
  'Gangneung',
  '커피의 도시이자 아름다운 동해바다를 끼고 있는 매력적인 도시입니다.',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
  1450000,
  234,
  45,
  '100~200만원',
  '강원도',
  ARRAY['자연친화', '카페작업'],
  ARRAY['여름', '겨울']
),
(
  '전주',
  'Jeonju',
  '한옥마을과 맛있는 음식으로 유명한 전통과 현대가 공존하는 도시입니다.',
  'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17',
  1350000,
  187,
  38,
  '100~200만원',
  '전라도',
  ARRAY['도심선호', '자연친화'],
  ARRAY['봄', '가을']
),
(
  '대전',
  'Daejeon',
  '대한민국의 중심, 과학과 교육의 도시로 조용하고 살기 좋은 곳입니다.',
  'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21',
  1550000,
  156,
  52,
  '100~200만원',
  '충청도',
  ARRAY['도심선호', '카페작업', '코워킹 필수'],
  ARRAY['봄', '가을']
),
(
  '춘천',
  'Chuncheon',
  '아름다운 호수와 자연에 둘러싸인 평화로운 도시입니다.',
  'https://images.unsplash.com/photo-1611348586804-61bf6c080437',
  980000,
  203,
  29,
  '100만원 이하',
  '강원도',
  ARRAY['자연친화', '카페작업'],
  ARRAY['여름', '겨울']
),
(
  '경주',
  'Gyeongju',
  '천년 고도의 역사와 문화가 살아 숨 쉬는 아름다운 도시입니다.',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
  890000,
  178,
  41,
  '100만원 이하',
  '경상도',
  ARRAY['자연친화', '도심선호'],
  ARRAY['봄', '여름', '가을']
),
(
  '여수',
  'Yeosu',
  '아름다운 남해바다와 섬들이 어우러진 낭만적인 항구도시입니다.',
  'https://images.unsplash.com/photo-1591604021695-0c69b7c05981',
  970000,
  265,
  37,
  '100만원 이하',
  '전라도',
  ARRAY['자연친화', '도심선호'],
  ARRAY['여름', '가을']
),
(
  '속초',
  'Sokcho',
  '설악산과 동해바다가 만나는 자연의 보고, 신선한 해산물의 도시입니다.',
  'https://images.unsplash.com/photo-1604357209793-fca5dca89f97',
  920000,
  219,
  43,
  '100만원 이하',
  '강원도',
  ARRAY['자연친화', '카페작업'],
  ARRAY['여름', '겨울']
);

-- ============================================
-- Setup Complete!
-- ============================================
