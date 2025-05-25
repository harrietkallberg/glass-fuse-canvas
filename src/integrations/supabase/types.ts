export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      curve_phases: {
        Row: {
          duration: number
          hold_time: number
          id: string
          phase_order: number
          target_temp: number
          version_id: string
        }
        Insert: {
          duration?: number
          hold_time?: number
          id?: string
          phase_order: number
          target_temp?: number
          version_id: string
        }
        Update: {
          duration?: number
          hold_time?: number
          id?: string
          phase_order?: number
          target_temp?: number
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "curve_phases_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "curve_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      curve_versions: {
        Row: {
          created_at: string
          curve_id: string
          firing_type: string | null
          glass_layers: string | null
          glass_radius: string | null
          id: string
          is_current: boolean
          materials: string | null
          name: string
          notes: string | null
          oven_type: string | null
          room_temp: number | null
          selected_glass: string | null
          tags: string | null
          top_temp_minutes: string | null
          total_time: number | null
          version_number: number
        }
        Insert: {
          created_at?: string
          curve_id: string
          firing_type?: string | null
          glass_layers?: string | null
          glass_radius?: string | null
          id?: string
          is_current?: boolean
          materials?: string | null
          name?: string
          notes?: string | null
          oven_type?: string | null
          room_temp?: number | null
          selected_glass?: string | null
          tags?: string | null
          top_temp_minutes?: string | null
          total_time?: number | null
          version_number?: number
        }
        Update: {
          created_at?: string
          curve_id?: string
          firing_type?: string | null
          glass_layers?: string | null
          glass_radius?: string | null
          id?: string
          is_current?: boolean
          materials?: string | null
          name?: string
          notes?: string | null
          oven_type?: string | null
          room_temp?: number | null
          selected_glass?: string | null
          tags?: string | null
          top_temp_minutes?: string | null
          total_time?: number | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "curve_versions_curve_id_fkey"
            columns: ["curve_id"]
            isOneToOne: false
            referencedRelation: "curves"
            referencedColumns: ["id"]
          },
        ]
      }
      curves: {
        Row: {
          created_at: string
          description: string | null
          glass_type: string | null
          id: string
          is_private: boolean
          oven_type: string | null
          project_type: string | null
          thickness: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          glass_type?: string | null
          id?: string
          is_private?: boolean
          oven_type?: string | null
          project_type?: string | null
          thickness?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          glass_type?: string | null
          id?: string
          is_private?: boolean
          oven_type?: string | null
          project_type?: string | null
          thickness?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "curves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          username?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
