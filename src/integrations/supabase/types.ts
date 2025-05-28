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
      documents: {
        Row: {
          category: string
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string | null
          id: string
          processed: boolean
          title: string
          updated_at: string
          upload_date: string
          user_id: string
          vendor: string
        }
        Insert: {
          category: string
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          file_url?: string | null
          id?: string
          processed?: boolean
          title: string
          updated_at?: string
          upload_date?: string
          user_id: string
          vendor: string
        }
        Update: {
          category?: string
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string | null
          id?: string
          processed?: boolean
          title?: string
          updated_at?: string
          upload_date?: string
          user_id?: string
          vendor?: string
        }
        Relationships: []
      }
      extracted_data: {
        Row: {
          account_number: string | null
          amount: number | null
          confidence_score: number | null
          created_at: string
          description: string | null
          document_id: string
          due_date: string | null
          id: string
          raw_text: string | null
          transaction_date: string | null
        }
        Insert: {
          account_number?: string | null
          amount?: number | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          document_id: string
          due_date?: string | null
          id?: string
          raw_text?: string | null
          transaction_date?: string | null
        }
        Update: {
          account_number?: string | null
          amount?: number | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          document_id?: string
          due_date?: string | null
          id?: string
          raw_text?: string | null
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extracted_data_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_reminders: {
        Row: {
          amount: number | null
          category: string
          created_at: string
          document_id: string | null
          due_date: string
          id: string
          is_completed: boolean
          title: string
          user_id: string
          vendor: string
        }
        Insert: {
          amount?: number | null
          category: string
          created_at?: string
          document_id?: string | null
          due_date: string
          id?: string
          is_completed?: boolean
          title: string
          user_id: string
          vendor: string
        }
        Update: {
          amount?: number | null
          category?: string
          created_at?: string
          document_id?: string | null
          due_date?: string
          id?: string
          is_completed?: boolean
          title?: string
          user_id?: string
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminders_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          am_pm: string
          created_at: string
          id: string
          is_completed: boolean
          location: string | null
          meeting_link: string | null
          name: string
          notes: string | null
          priority: string
          time: string
          user_id: string
        }
        Insert: {
          am_pm: string
          created_at?: string
          id?: string
          is_completed?: boolean
          location?: string | null
          meeting_link?: string | null
          name: string
          notes?: string | null
          priority: string
          time: string
          user_id?: string
        }
        Update: {
          am_pm?: string
          created_at?: string
          id?: string
          is_completed?: boolean
          location?: string | null
          meeting_link?: string | null
          name?: string
          notes?: string | null
          priority?: string
          time?: string
          user_id?: string
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
