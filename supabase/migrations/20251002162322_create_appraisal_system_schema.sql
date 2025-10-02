-- Create Appraisal System Schema
--
-- Overview:
-- Creates the complete database schema for the AI-powered item appraisal system.
-- This includes tables for user profiles, appraisals, images, and market data.
--
-- New Tables:
-- 1. profiles - User profile information
-- 2. appraisals - Main appraisal records with AI analysis
-- 3. appraisal_images - Multiple images per appraisal
-- 4. market_comparables - Reference data for similar items
-- 5. valuation_history - Track analysis iterations
--
-- Security:
-- RLS enabled on all tables with appropriate access policies

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Appraisals table
CREATE TABLE IF NOT EXISTS appraisals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  category text NOT NULL,
  item_description text NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'analyzing', 'completed', 'expert_review', 'failed')),
  ai_analysis jsonb,
  estimated_value_low numeric(12, 2),
  estimated_value_high numeric(12, 2),
  currency text DEFAULT 'USD' NOT NULL,
  confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100),
  item_identification text,
  condition_assessment text,
  market_context text,
  valuation_methodology text,
  recommendations text[],
  requires_expert_review boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- 3. Appraisal images table
CREATE TABLE IF NOT EXISTS appraisal_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appraisal_id uuid REFERENCES appraisals(id) ON DELETE CASCADE NOT NULL,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Market comparables table
CREATE TABLE IF NOT EXISTS market_comparables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appraisal_id uuid REFERENCES appraisals(id) ON DELETE CASCADE NOT NULL,
  item_name text NOT NULL,
  sale_price numeric(12, 2),
  sale_date date,
  source text,
  source_url text,
  similarity_score numeric(3, 2) CHECK (similarity_score >= 0 AND similarity_score <= 1),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Valuation history table
CREATE TABLE IF NOT EXISTS valuation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appraisal_id uuid REFERENCES appraisals(id) ON DELETE CASCADE NOT NULL,
  analysis_type text NOT NULL CHECK (analysis_type IN ('ai_initial', 'ai_revision', 'expert_review')),
  analysis_data jsonb NOT NULL,
  performed_by text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appraisals_user_id ON appraisals(user_id);
CREATE INDEX IF NOT EXISTS idx_appraisals_status ON appraisals(status);
CREATE INDEX IF NOT EXISTS idx_appraisals_category ON appraisals(category);
CREATE INDEX IF NOT EXISTS idx_appraisals_created_at ON appraisals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appraisal_images_appraisal_id ON appraisal_images(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_market_comparables_appraisal_id ON market_comparables(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_valuation_history_appraisal_id ON valuation_history(appraisal_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_comparables ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for appraisals
CREATE POLICY "Users can view own appraisals"
  ON appraisals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create appraisals"
  ON appraisals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can create appraisals"
  ON appraisals FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Anonymous users can view their appraisals"
  ON appraisals FOR SELECT
  TO anon
  USING (user_id IS NULL);

CREATE POLICY "Users can update own appraisals"
  ON appraisals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appraisal_images
CREATE POLICY "Users can view images for their appraisals"
  ON appraisal_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appraisals
      WHERE appraisals.id = appraisal_images.appraisal_id
      AND appraisals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert images for their appraisals"
  ON appraisal_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appraisals
      WHERE appraisals.id = appraisal_images.appraisal_id
      AND appraisals.user_id = auth.uid()
    )
  );

CREATE POLICY "Anonymous users can view images for their appraisals"
  ON appraisal_images FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM appraisals
      WHERE appraisals.id = appraisal_images.appraisal_id
      AND appraisals.user_id IS NULL
    )
  );

CREATE POLICY "Anonymous users can insert images"
  ON appraisal_images FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for market_comparables
CREATE POLICY "Users can view comparables for their appraisals"
  ON market_comparables FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appraisals
      WHERE appraisals.id = market_comparables.appraisal_id
      AND appraisals.user_id = auth.uid()
    )
  );

CREATE POLICY "Anonymous users can view comparables"
  ON market_comparables FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM appraisals
      WHERE appraisals.id = market_comparables.appraisal_id
      AND appraisals.user_id IS NULL
    )
  );

-- RLS Policies for valuation_history
CREATE POLICY "Users can view history for their appraisals"
  ON valuation_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appraisals
      WHERE appraisals.id = valuation_history.appraisal_id
      AND appraisals.user_id = auth.uid()
    )
  );

CREATE POLICY "Anonymous users can view history"
  ON valuation_history FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM appraisals
      WHERE appraisals.id = valuation_history.appraisal_id
      AND appraisals.user_id IS NULL
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appraisals_updated_at
  BEFORE UPDATE ON appraisals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();