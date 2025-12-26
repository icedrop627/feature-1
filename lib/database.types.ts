export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string
          name_ko: string
          name_en: string
          description: string | null
          cover_image: string | null
          monthly_cost: number | null
          likes: number
          dislikes: number
          budget: '100만원 이하' | '100~200만원' | '200만원 이상' | null
          region: '수도권' | '경상도' | '전라도' | '강원도' | '제주도' | '충청도' | null
          environment: string[] | null
          best_season: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_ko: string
          name_en: string
          description?: string | null
          cover_image?: string | null
          monthly_cost?: number | null
          likes?: number
          dislikes?: number
          budget?: '100만원 이하' | '100~200만원' | '200만원 이상' | null
          region?: '수도권' | '경상도' | '전라도' | '강원도' | '제주도' | '충청도' | null
          environment?: string[] | null
          best_season?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_ko?: string
          name_en?: string
          description?: string | null
          cover_image?: string | null
          monthly_cost?: number | null
          likes?: number
          dislikes?: number
          budget?: '100만원 이하' | '100~200만원' | '200만원 이상' | null
          region?: '수도권' | '경상도' | '전라도' | '강원도' | '제주도' | '충청도' | null
          environment?: string[] | null
          best_season?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          city_id: string
          user_id: string
          rating: number | null
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          city_id: string
          user_id: string
          rating?: number | null
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          city_id?: string
          user_id?: string
          rating?: number | null
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      city_reactions: {
        Row: {
          id: string
          city_id: string
          user_id: string
          reaction_type: 'like' | 'dislike' | null
          created_at: string
        }
        Insert: {
          id?: string
          city_id: string
          user_id: string
          reaction_type?: 'like' | 'dislike' | null
          created_at?: string
        }
        Update: {
          id?: string
          city_id?: string
          user_id?: string
          reaction_type?: 'like' | 'dislike' | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
