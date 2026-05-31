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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_events: {
        Row: {
          created_at: string
          id: string
          kind: string
          payload: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          payload?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          payload?: Json
          user_id?: string
        }
        Relationships: []
      }
      blocks: {
        Row: {
          id: string
          name: string
          number: number
          program_slug: string
          weeks: number[]
        }
        Insert: {
          id: string
          name: string
          number: number
          program_slug: string
          weeks: number[]
        }
        Update: {
          id?: string
          name?: string
          number?: number
          program_slug?: string
          weeks?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "blocks_program_slug_fkey"
            columns: ["program_slug"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["slug"]
          },
        ]
      }
      enrollments: {
        Row: {
          created_at: string
          current_day: number
          current_week: number
          id: string
          path: string
          program_slug: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_day?: number
          current_week?: number
          id?: string
          path: string
          program_slug: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_day?: number
          current_week?: number
          id?: string
          path?: string
          program_slug?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_program_slug_fkey"
            columns: ["program_slug"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["slug"]
          },
        ]
      }
      movements: {
        Row: {
          body_md: string
          id: string
          name: string
          pattern: string
          program_slug: string
          slug: string
          tag: string
        }
        Insert: {
          body_md?: string
          id: string
          name: string
          pattern: string
          program_slug: string
          slug: string
          tag?: string
        }
        Update: {
          body_md?: string
          id?: string
          name?: string
          pattern?: string
          program_slug?: string
          slug?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "movements_program_slug_fkey"
            columns: ["program_slug"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["slug"]
          },
        ]
      }
      prescribed_items: {
        Row: {
          distance_m: number | null
          duration_sec: number | null
          id: string
          kind: string
          load_hint: string | null
          movement_id: string | null
          note: string | null
          order_idx: number
          per_side: boolean | null
          program_day_id: string
          raw_text: string
          rep_high: number | null
          rep_low: number | null
          sets: number | null
        }
        Insert: {
          distance_m?: number | null
          duration_sec?: number | null
          id: string
          kind: string
          load_hint?: string | null
          movement_id?: string | null
          note?: string | null
          order_idx: number
          per_side?: boolean | null
          program_day_id: string
          raw_text: string
          rep_high?: number | null
          rep_low?: number | null
          sets?: number | null
        }
        Update: {
          distance_m?: number | null
          duration_sec?: number | null
          id?: string
          kind?: string
          load_hint?: string | null
          movement_id?: string | null
          note?: string | null
          order_idx?: number
          per_side?: boolean | null
          program_day_id?: string
          raw_text?: string
          rep_high?: number | null
          rep_low?: number | null
          sets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prescribed_items_movement_id_fkey"
            columns: ["movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescribed_items_program_day_id_fkey"
            columns: ["program_day_id"]
            isOneToOne: false
            referencedRelation: "program_days"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          dark_mode: string
          display_name: string | null
          tier_entitlement: string
          units: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dark_mode?: string
          display_name?: string | null
          tier_entitlement?: string
          units?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dark_mode?: string
          display_name?: string | null
          tier_entitlement?: string
          units?: string
          user_id?: string
        }
        Relationships: []
      }
      program_days: {
        Row: {
          day: number
          duration_label: string
          id: string
          kind: string
          note: string
          path: string
          program_slug: string
          title: string
          week: number
        }
        Insert: {
          day: number
          duration_label?: string
          id: string
          kind: string
          note?: string
          path: string
          program_slug: string
          title: string
          week: number
        }
        Update: {
          day?: number
          duration_label?: string
          id?: string
          kind?: string
          note?: string
          path?: string
          program_slug?: string
          title?: string
          week?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_days_program_slug_fkey"
            columns: ["program_slug"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["slug"]
          },
        ]
      }
      programs: {
        Row: {
          length_weeks: number
          optional_days: string | null
          paths: string[]
          slug: string
          tier: string
          title: string
        }
        Insert: {
          length_weeks: number
          optional_days?: string | null
          paths: string[]
          slug: string
          tier: string
          title: string
        }
        Update: {
          length_weeks?: number
          optional_days?: string | null
          paths?: string[]
          slug?: string
          tier?: string
          title?: string
        }
        Relationships: []
      }
      set_logs: {
        Row: {
          completed: boolean
          created_at: string
          distance_m: number | null
          duration_sec: number | null
          id: string
          movement_id: string | null
          prescribed_item_id: string | null
          reps: number | null
          session_id: string
          set_index: number
          updated_at: string
          user_id: string
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string
          distance_m?: number | null
          duration_sec?: number | null
          id?: string
          movement_id?: string | null
          prescribed_item_id?: string | null
          reps?: number | null
          session_id: string
          set_index: number
          updated_at?: string
          user_id: string
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string
          distance_m?: number | null
          duration_sec?: number | null
          id?: string
          movement_id?: string | null
          prescribed_item_id?: string | null
          reps?: number | null
          session_id?: string
          set_index?: number
          updated_at?: string
          user_id?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "set_logs_movement_id_fkey"
            columns: ["movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_logs_prescribed_item_id_fkey"
            columns: ["prescribed_item_id"]
            isOneToOne: false
            referencedRelation: "prescribed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          body_weight: number | null
          created_at: string
          enrollment_id: string | null
          id: string
          notes: string | null
          performed_at: string
          program_day_id: string | null
          rpe: number | null
          sleep_prior: number | null
          user_id: string
        }
        Insert: {
          body_weight?: number | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          notes?: string | null
          performed_at?: string
          program_day_id?: string | null
          rpe?: number | null
          sleep_prior?: number | null
          user_id: string
        }
        Update: {
          body_weight?: number | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          notes?: string | null
          performed_at?: string
          program_day_id?: string | null
          rpe?: number | null
          sleep_prior?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_program_day_id_fkey"
            columns: ["program_day_id"]
            isOneToOne: false
            referencedRelation: "program_days"
            referencedColumns: ["id"]
          },
        ]
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
