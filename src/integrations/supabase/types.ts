export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id: string
          name: string
          requirement: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement?: string
        }
        Relationships: []
      }
      cosmetic_items: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          preview_emoji: string
          price: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id: string
          name: string
          preview_emoji?: string
          price?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          preview_emoji?: string
          price?: number
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      investment_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          event_text: string | null
          id: string
          stock_id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          event_text?: string | null
          id?: string
          stock_id: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          event_text?: string | null
          id?: string
          stock_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_transactions_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      market_events: {
        Row: {
          created_at: string
          event_text: string
          id: string
          price_impact_percent: number
          stock_id: string
        }
        Insert: {
          created_at?: string
          event_text: string
          id?: string
          price_impact_percent?: number
          stock_id: string
        }
        Update: {
          created_at?: string
          event_text?: string
          id?: string
          price_impact_percent?: number
          stock_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_events_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coins: number
          created_at: string
          current_streak: number
          display_name: string | null
          id: string
          longest_streak: number
          selected_character: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          current_streak?: number
          display_name?: string | null
          id?: string
          longest_streak?: number
          selected_character?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          current_streak?: number
          display_name?: string | null
          id?: string
          longest_streak?: number
          selected_character?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stocks: {
        Row: {
          base_volatility: number
          created_at: string
          current_price: number
          description: string
          icon: string
          id: string
          name: string
          price_change_percent: number
          sector: string
          updated_at: string
        }
        Insert: {
          base_volatility?: number
          created_at?: string
          current_price?: number
          description: string
          icon?: string
          id: string
          name: string
          price_change_percent?: number
          sector?: string
          updated_at?: string
        }
        Update: {
          base_volatility?: number
          created_at?: string
          current_price?: number
          description?: string
          icon?: string
          id?: string
          name?: string
          price_change_percent?: number
          sector?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cosmetics: {
        Row: {
          equipped: boolean
          id: string
          item_id: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          equipped?: boolean
          id?: string
          item_id: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          equipped?: boolean
          id?: string
          item_id?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cosmetics_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "cosmetic_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_investments: {
        Row: {
          current_value: number
          id: string
          invested_at: string
          invested_coins: number
          is_active: boolean
          last_update: string
          stock_id: string
          user_id: string
        }
        Insert: {
          current_value: number
          id?: string
          invested_at?: string
          invested_coins: number
          is_active?: boolean
          last_update?: string
          stock_id: string
          user_id: string
        }
        Update: {
          current_value?: number
          id?: string
          invested_at?: string
          invested_coins?: number
          is_active?: boolean
          last_update?: string
          stock_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_investments_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          score: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          score?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          score?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
