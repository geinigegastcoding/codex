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
      users: {
        Row: {
          id: string
          email: string
          city_name: string | null
          streak_count: number
          created_at: string
        }
        Insert: {
          id: string
          email: string
          city_name?: string | null
          streak_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          city_name?: string | null
          streak_count?: number
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          source_name: string
          title: string
          description: string | null
          url: string
          published_at: string
          tags: string[]
          is_breaking: boolean
          content_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          source_name: string
          title: string
          description?: string | null
          url: string
          published_at: string
          tags?: string[]
          is_breaking?: boolean
          content_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          source_name?: string
          title?: string
          description?: string | null
          url?: string
          published_at?: string
          tags?: string[]
          is_breaking?: boolean
          content_hash?: string
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          tag_name: string
          weight: number
        }
        Insert: {
          user_id: string
          tag_name: string
          weight?: number
        }
        Update: {
          user_id?: string
          tag_name?: string
          weight?: number
        }
      }
      user_interactions: {
        Row: {
          user_id: string
          article_id: string
          is_read: boolean
          is_saved: boolean
          interacted_at: string
        }
        Insert: {
          user_id: string
          article_id: string
          is_read?: boolean
          is_saved?: boolean
          interacted_at?: string
        }
        Update: {
          user_id?: string
          article_id?: string
          is_read?: boolean
          is_saved?: boolean
          interacted_at?: string
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
