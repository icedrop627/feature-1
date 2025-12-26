-- Create cities table
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
