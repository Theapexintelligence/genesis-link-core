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
      adapters: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          last_used: string | null
          name: string
          params: Json | null
          service: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          last_used?: string | null
          name: string
          params?: Json | null
          service: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          last_used?: string | null
          name?: string
          params?: Json | null
          service?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      api_tests: {
        Row: {
          body: Json | null
          created_at: string | null
          endpoint: string
          expected_response: Json | null
          headers: Json | null
          id: string
          last_response: Json | null
          last_status: number | null
          method: string
          name: string
          updated_at: string | null
        }
        Insert: {
          body?: Json | null
          created_at?: string | null
          endpoint: string
          expected_response?: Json | null
          headers?: Json | null
          id?: string
          last_response?: Json | null
          last_status?: number | null
          method: string
          name: string
          updated_at?: string | null
        }
        Update: {
          body?: Json | null
          created_at?: string | null
          endpoint?: string
          expected_response?: Json | null
          headers?: Json | null
          id?: string
          last_response?: Json | null
          last_status?: number | null
          method?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          component_name: string
          count: number | null
          first_occurred_at: string | null
          id: string
          is_resolved: boolean | null
          last_occurred_at: string | null
          message: string
          stack_trace: string | null
          suggested_fix: string | null
        }
        Insert: {
          component_name: string
          count?: number | null
          first_occurred_at?: string | null
          id?: string
          is_resolved?: boolean | null
          last_occurred_at?: string | null
          message: string
          stack_trace?: string | null
          suggested_fix?: string | null
        }
        Update: {
          component_name?: string
          count?: number | null
          first_occurred_at?: string | null
          id?: string
          is_resolved?: boolean | null
          last_occurred_at?: string | null
          message?: string
          stack_trace?: string | null
          suggested_fix?: string | null
        }
        Relationships: []
      }
      system_health: {
        Row: {
          id: string
          metrics: Json
          timestamp: string | null
        }
        Insert: {
          id?: string
          metrics: Json
          timestamp?: string | null
        }
        Update: {
          id?: string
          metrics?: Json
          timestamp?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string | null
          complexity: string | null
          configuration: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          services: string[]
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          complexity?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          services: string[]
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          complexity?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          services?: string[]
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workflows: {
        Row: {
          active: boolean | null
          connections: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          connections?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          connections?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
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
