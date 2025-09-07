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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      auth_schema_fixes: {
        Row: {
          affected_rows: number | null
          column_name: string
          created_at: string | null
          description: string
          id: number
          operation: string
          status: string
          table_name: string
        }
        Insert: {
          affected_rows?: number | null
          column_name: string
          created_at?: string | null
          description: string
          id?: never
          operation: string
          status: string
          table_name: string
        }
        Update: {
          affected_rows?: number | null
          column_name?: string
          created_at?: string | null
          description?: string
          id?: never
          operation?: string
          status?: string
          table_name?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          agent_id: string
          approval_status: string | null
          created_at: string | null
          days: Json
          destination: string
          end_date: string
          id: string
          name: string
          number_of_travelers: number
          preferences: string | null
          share_token: string | null
          start_date: string
          status: string
          traveler_id: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          approval_status?: string | null
          created_at?: string | null
          days?: Json
          destination: string
          end_date: string
          id?: string
          name: string
          number_of_travelers?: number
          preferences?: string | null
          share_token?: string | null
          start_date: string
          status?: string
          traveler_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          approval_status?: string | null
          created_at?: string | null
          days?: Json
          destination?: string
          end_date?: string
          id?: string
          name?: string
          number_of_travelers?: number
          preferences?: string | null
          share_token?: string | null
          start_date?: string
          status?: string
          traveler_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itineraries_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_items: {
        Row: {
          assigned_vendor_id: string | null
          created_at: string | null
          day_number: number
          description: string | null
          duration_hours: number | null
          estimated_price: number | null
          id: string
          is_negotiable: boolean | null
          item_type: string
          itinerary_id: string | null
          location: string | null
          market_rate_reference: number | null
          negotiation_priority: string | null
          participants: number | null
          service_name: string
          special_requirements: Json | null
          suggested_vendors: string[] | null
          updated_at: string | null
        }
        Insert: {
          assigned_vendor_id?: string | null
          created_at?: string | null
          day_number: number
          description?: string | null
          duration_hours?: number | null
          estimated_price?: number | null
          id?: string
          is_negotiable?: boolean | null
          item_type: string
          itinerary_id?: string | null
          location?: string | null
          market_rate_reference?: number | null
          negotiation_priority?: string | null
          participants?: number | null
          service_name: string
          special_requirements?: Json | null
          suggested_vendors?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_vendor_id?: string | null
          created_at?: string | null
          day_number?: number
          description?: string | null
          duration_hours?: number | null
          estimated_price?: number | null
          id?: string
          is_negotiable?: boolean | null
          item_type?: string
          itinerary_id?: string | null
          location?: string | null
          market_rate_reference?: number | null
          negotiation_priority?: string | null
          participants?: number | null
          service_name?: string
          special_requirements?: Json | null
          suggested_vendors?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_items_assigned_vendor_id_fkey"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_items_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      market_intelligence: {
        Row: {
          average_negotiation_rounds: number | null
          confidence_score: number | null
          created_at: string | null
          group_size_factors: Json | null
          id: string
          last_updated: string | null
          location: string
          market_rate_avg: number | null
          market_rate_max: number | null
          market_rate_min: number | null
          max_achievable_discount_pct: number | null
          negotiation_success_rate: number | null
          optimal_timing_hours: number[] | null
          sample_size: number | null
          season: string | null
          seasonal_factors: Json | null
          service_name: string | null
          service_type: string
          typical_discount_pct: number | null
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          average_negotiation_rounds?: number | null
          confidence_score?: number | null
          created_at?: string | null
          group_size_factors?: Json | null
          id?: string
          last_updated?: string | null
          location: string
          market_rate_avg?: number | null
          market_rate_max?: number | null
          market_rate_min?: number | null
          max_achievable_discount_pct?: number | null
          negotiation_success_rate?: number | null
          optimal_timing_hours?: number[] | null
          sample_size?: number | null
          season?: string | null
          seasonal_factors?: Json | null
          service_name?: string | null
          service_type: string
          typical_discount_pct?: number | null
          valid_from: string
          valid_until?: string | null
        }
        Update: {
          average_negotiation_rounds?: number | null
          confidence_score?: number | null
          created_at?: string | null
          group_size_factors?: Json | null
          id?: string
          last_updated?: string | null
          location?: string
          market_rate_avg?: number | null
          market_rate_max?: number | null
          market_rate_min?: number | null
          max_achievable_discount_pct?: number | null
          negotiation_success_rate?: number | null
          optimal_timing_hours?: number[] | null
          sample_size?: number | null
          season?: string | null
          seasonal_factors?: Json | null
          service_name?: string | null
          service_type?: string
          typical_discount_pct?: number | null
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      negotiation_history: {
        Row: {
          action_type: string
          actor_id: string
          actor_role: string
          ai_confidence_score: number | null
          created_at: string | null
          id: string
          negotiation_id: string
          new_value: Json | null
          notes: string | null
          previous_value: Json | null
        }
        Insert: {
          action_type: string
          actor_id: string
          actor_role: string
          ai_confidence_score?: number | null
          created_at?: string | null
          id?: string
          negotiation_id: string
          new_value?: Json | null
          notes?: string | null
          previous_value?: Json | null
        }
        Update: {
          action_type?: string
          actor_id?: string
          actor_role?: string
          ai_confidence_score?: number | null
          created_at?: string | null
          id?: string
          negotiation_id?: string
          new_value?: Json | null
          notes?: string | null
          previous_value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "negotiation_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negotiation_history_negotiation_id_fkey"
            columns: ["negotiation_id"]
            isOneToOne: false
            referencedRelation: "negotiations"
            referencedColumns: ["id"]
          },
        ]
      }
      negotiation_templates: {
        Row: {
          body_template: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          service_type: string
          subject_template: string
          success_rate: number | null
          template_type: string | null
          tone: string | null
          usage_count: number | null
        }
        Insert: {
          body_template: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          service_type: string
          subject_template: string
          success_rate?: number | null
          template_type?: string | null
          tone?: string | null
          usage_count?: number | null
        }
        Update: {
          body_template?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          service_type?: string
          subject_template?: string
          success_rate?: number | null
          template_type?: string | null
          tone?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      negotiations: {
        Row: {
          agent_id: string
          auto_approval_threshold: number | null
          created_at: string | null
          description: string
          final_price: number | null
          id: string
          itinerary_id: string
          itinerary_item_id: string | null
          messages: Json
          negotiation_deadline: string | null
          negotiation_priority: string | null
          original_price: number | null
          service_type: string
          status: string
          target_price: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          agent_id: string
          auto_approval_threshold?: number | null
          created_at?: string | null
          description: string
          final_price?: number | null
          id?: string
          itinerary_id: string
          itinerary_item_id?: string | null
          messages?: Json
          negotiation_deadline?: string | null
          negotiation_priority?: string | null
          original_price?: number | null
          service_type: string
          status?: string
          target_price?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          agent_id?: string
          auto_approval_threshold?: number | null
          created_at?: string | null
          description?: string
          final_price?: number | null
          id?: string
          itinerary_id?: string
          itinerary_item_id?: string | null
          messages?: Json
          negotiation_deadline?: string | null
          negotiation_priority?: string | null
          original_price?: number | null
          service_type?: string
          status?: string
          target_price?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "negotiations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negotiations_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negotiations_itinerary_item_id_fkey"
            columns: ["itinerary_item_id"]
            isOneToOne: false
            referencedRelation: "itinerary_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negotiations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          priority: string | null
          title: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          priority?: string | null
          title: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          priority?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      vendor_profiles: {
        Row: {
          business_license: string | null
          company_name: string
          contact_person: string | null
          contract_terms: Json | null
          coverage_areas: string[]
          created_at: string | null
          phone: string | null
          preferred_partner: boolean | null
          response_time_avg_hours: number | null
          service_specializations: string[]
          success_rate: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_license?: string | null
          company_name: string
          contact_person?: string | null
          contract_terms?: Json | null
          coverage_areas: string[]
          created_at?: string | null
          phone?: string | null
          preferred_partner?: boolean | null
          response_time_avg_hours?: number | null
          service_specializations: string[]
          success_rate?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_license?: string | null
          company_name?: string
          contact_person?: string | null
          contract_terms?: Json | null
          coverage_areas?: string[]
          created_at?: string | null
          phone?: string | null
          preferred_partner?: boolean | null
          response_time_avg_hours?: number | null
          service_specializations?: string[]
          success_rate?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_services: {
        Row: {
          availability: Json | null
          base_price: number | null
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          market_rate_reference: number | null
          negotiable_discount_max: number | null
          service_name: string
          service_type: string
          specializations: Json | null
          vendor_id: string
        }
        Insert: {
          availability?: Json | null
          base_price?: number | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          market_rate_reference?: number | null
          negotiable_discount_max?: number | null
          service_name: string
          service_type: string
          specializations?: Json | null
          vendor_id: string
        }
        Update: {
          availability?: Json | null
          base_price?: number | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          market_rate_reference?: number | null
          negotiable_discount_max?: number | null
          service_name?: string
          service_type?: string
          specializations?: Json | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_auth_schema_health: {
        Args: Record<PropertyKey, never>
        Returns: {
          column_name: string
          health_status: string
          null_count: number
          table_name: string
          total_rows: number
        }[]
      }
      get_itinerary_by_token: {
        Args: { _token: string }
        Returns: {
          agent_id: string
          approval_status: string | null
          created_at: string | null
          days: Json
          destination: string
          end_date: string
          id: string
          name: string
          number_of_travelers: number
          preferences: string | null
          share_token: string | null
          start_date: string
          status: string
          traveler_id: string | null
          updated_at: string | null
        }[]
      }
      get_user_role_from_auth: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
