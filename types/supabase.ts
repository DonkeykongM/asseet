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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appraisals: {
        Row: {
          id: string
          user_id: string | null
          category: string
          item_description: string
          status: 'pending' | 'analyzing' | 'completed' | 'expert_review' | 'failed'
          ai_analysis: Json | null
          estimated_value_low: number | null
          estimated_value_high: number | null
          currency: string
          confidence_score: number | null
          item_identification: string | null
          condition_assessment: string | null
          market_context: string | null
          valuation_methodology: string | null
          recommendations: string[] | null
          requires_expert_review: boolean
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          category: string
          item_description: string
          status?: 'pending' | 'analyzing' | 'completed' | 'expert_review' | 'failed'
          ai_analysis?: Json | null
          estimated_value_low?: number | null
          estimated_value_high?: number | null
          currency?: string
          confidence_score?: number | null
          item_identification?: string | null
          condition_assessment?: string | null
          market_context?: string | null
          valuation_methodology?: string | null
          recommendations?: string[] | null
          requires_expert_review?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          category?: string
          item_description?: string
          status?: 'pending' | 'analyzing' | 'completed' | 'expert_review' | 'failed'
          ai_analysis?: Json | null
          estimated_value_low?: number | null
          estimated_value_high?: number | null
          currency?: string
          confidence_score?: number | null
          item_identification?: string | null
          condition_assessment?: string | null
          market_context?: string | null
          valuation_methodology?: string | null
          recommendations?: string[] | null
          requires_expert_review?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      appraisal_images: {
        Row: {
          id: string
          appraisal_id: string
          storage_path: string
          file_name: string
          file_size: number
          mime_type: string
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          appraisal_id: string
          storage_path: string
          file_name: string
          file_size: number
          mime_type: string
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          appraisal_id?: string
          storage_path?: string
          file_name?: string
          file_size?: number
          mime_type?: string
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      market_comparables: {
        Row: {
          id: string
          appraisal_id: string
          item_name: string
          sale_price: number | null
          sale_date: string | null
          source: string | null
          source_url: string | null
          similarity_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          appraisal_id: string
          item_name: string
          sale_price?: number | null
          sale_date?: string | null
          source?: string | null
          source_url?: string | null
          similarity_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          appraisal_id?: string
          item_name?: string
          sale_price?: number | null
          sale_date?: string | null
          source?: string | null
          source_url?: string | null
          similarity_score?: number | null
          created_at?: string
        }
      }
      valuation_history: {
        Row: {
          id: string
          appraisal_id: string
          analysis_type: 'ai_initial' | 'ai_revision' | 'expert_review'
          analysis_data: Json
          performed_by: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          appraisal_id: string
          analysis_type: 'ai_initial' | 'ai_revision' | 'expert_review'
          analysis_data: Json
          performed_by: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          appraisal_id?: string
          analysis_type?: 'ai_initial' | 'ai_revision' | 'expert_review'
          analysis_data?: Json
          performed_by?: string
          notes?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
