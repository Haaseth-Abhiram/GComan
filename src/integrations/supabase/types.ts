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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          email_error: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          id: string
          ip_address: string | null
          message: string
          name: string
          phone: string | null
          subject: string
          synced_to_zoho: boolean | null
          updated_at: string
          zoho_lead_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          email_error?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          ip_address?: string | null
          message: string
          name: string
          phone?: string | null
          subject: string
          synced_to_zoho?: boolean | null
          updated_at?: string
          zoho_lead_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          email_error?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string
          synced_to_zoho?: boolean | null
          updated_at?: string
          zoho_lead_id?: string | null
        }
        Relationships: []
      }
      download_leads: {
        Row: {
          company: string
          country: string
          created_at: string
          email: string
          id: string
          industry: string | null
          marketing_consent: boolean | null
          name: string
          phone: string
          resource_title: string
        }
        Insert: {
          company: string
          country: string
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          marketing_consent?: boolean | null
          name: string
          phone: string
          resource_title: string
        }
        Update: {
          company?: string
          country?: string
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          marketing_consent?: boolean | null
          name?: string
          phone?: string
          resource_title?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_letter: string
          created_at: string
          email: string
          experience: string
          hr_notes: string | null
          id: string
          linkedin_url: string | null
          name: string
          phone: string
          position: string
          prospect: Database["public"]["Enums"]["application_prospect"]
          resume_path: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          cover_letter: string
          created_at?: string
          email: string
          experience: string
          hr_notes?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          phone: string
          position: string
          prospect?: Database["public"]["Enums"]["application_prospect"]
          resume_path: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Update: {
          cover_letter?: string
          created_at?: string
          email?: string
          experience?: string
          hr_notes?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          phone?: string
          position?: string
          prospect?: Database["public"]["Enums"]["application_prospect"]
          resume_path?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          is_active: boolean
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_analytics_snapshots: {
        Row: {
          avg_bounce_rate: number
          avg_pages_per_visit: number
          country_breakdown: Json
          created_at: string
          daily_data: Json
          device_breakdown: Json
          id: string
          period_end: string
          period_start: string
          top_pages: Json
          total_pageviews: number
          total_visitors: number
          traffic_sources: Json
        }
        Insert: {
          avg_bounce_rate?: number
          avg_pages_per_visit?: number
          country_breakdown?: Json
          created_at?: string
          daily_data?: Json
          device_breakdown?: Json
          id?: string
          period_end: string
          period_start: string
          top_pages?: Json
          total_pageviews?: number
          total_visitors?: number
          traffic_sources?: Json
        }
        Update: {
          avg_bounce_rate?: number
          avg_pages_per_visit?: number
          country_breakdown?: Json
          created_at?: string
          daily_data?: Json
          device_breakdown?: Json
          id?: string
          period_end?: string
          period_start?: string
          top_pages?: Json
          total_pageviews?: number
          total_visitors?: number
          traffic_sources?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_admin_role: { Args: { user_email: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      application_prospect: "low" | "medium" | "high" | "top"
      application_status:
        | "new"
        | "reviewed"
        | "shortlisted"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      application_prospect: ["low", "medium", "high", "top"],
      application_status: [
        "new",
        "reviewed",
        "shortlisted",
        "interview",
        "offer",
        "hired",
        "rejected",
      ],
    },
  },
} as const
