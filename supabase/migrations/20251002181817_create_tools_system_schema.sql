/*
  # Tools System Schema

  ## Overview
  Creates a comprehensive database schema for the valuation tools system including
  tool usage tracking, saved analyses, user preferences, and tool results storage.

  ## New Tables
  
  ### `tool_usage_history`
  - `id` (uuid, primary key) - Unique identifier for each tool usage
  - `user_id` (uuid, foreign key) - References auth.users
  - `tool_slug` (text) - Identifier for which tool was used
  - `tool_name` (text) - Display name of the tool
  - `input_data` (jsonb) - Stores the input parameters used
  - `result_data` (jsonb) - Stores the output/results from the tool
  - `created_at` (timestamptz) - When the tool was used
  - `updated_at` (timestamptz) - Last modification time
  
  ### `saved_analyses`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `tool_slug` (text) - Which tool generated this analysis
  - `title` (text) - User-defined title for the analysis
  - `analysis_data` (jsonb) - Complete analysis results
  - `is_favorite` (boolean) - Whether user marked as favorite
  - `tags` (text[]) - User-defined tags for organization
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `tool_preferences`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `favorite_tools` (text[]) - Array of tool slugs user favorites
  - `recent_tools` (text[]) - Recently used tool slugs
  - `default_settings` (jsonb) - User's default settings per tool
  - `notification_preferences` (jsonb) - Alert settings for price changes etc
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `market_data_cache`
  - `id` (uuid, primary key) - Unique identifier
  - `category` (text) - Item category
  - `item_identifier` (text) - Specific item or type
  - `price_data` (jsonb) - Historical price information
  - `sales_data` (jsonb) - Recent sales records
  - `trend_data` (jsonb) - Market trend analysis
  - `data_source` (text) - Where the data came from
  - `last_updated` (timestamptz) - When data was last refreshed
  - `created_at` (timestamptz) - Initial creation time

  ### `price_alerts`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `category` (text) - Category to monitor
  - `item_name` (text) - Specific item or keyword
  - `alert_type` (text) - Type of alert (price_increase, price_decrease, new_sale, etc)
  - `threshold_value` (numeric) - Trigger value for alert
  - `is_active` (boolean) - Whether alert is currently active
  - `last_triggered` (timestamptz) - Last time alert fired
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Market data cache is read-only for all authenticated users
*/

-- Create tool_usage_history table
CREATE TABLE IF NOT EXISTS tool_usage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug text NOT NULL,
  tool_name text NOT NULL,
  input_data jsonb DEFAULT '{}'::jsonb,
  result_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_analyses table
CREATE TABLE IF NOT EXISTS saved_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_slug text NOT NULL,
  title text NOT NULL,
  analysis_data jsonb NOT NULL,
  is_favorite boolean DEFAULT false,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tool_preferences table
CREATE TABLE IF NOT EXISTS tool_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  favorite_tools text[] DEFAULT ARRAY[]::text[],
  recent_tools text[] DEFAULT ARRAY[]::text[],
  default_settings jsonb DEFAULT '{}'::jsonb,
  notification_preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create market_data_cache table
CREATE TABLE IF NOT EXISTS market_data_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  item_identifier text NOT NULL,
  price_data jsonb DEFAULT '{}'::jsonb,
  sales_data jsonb DEFAULT '{}'::jsonb,
  trend_data jsonb DEFAULT '{}'::jsonb,
  data_source text DEFAULT 'internal',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(category, item_identifier)
);

-- Create price_alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  item_name text NOT NULL,
  alert_type text NOT NULL,
  threshold_value numeric,
  is_active boolean DEFAULT true,
  last_triggered timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON tool_usage_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created_at ON tool_usage_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_slug ON tool_usage_history(tool_slug);

CREATE INDEX IF NOT EXISTS idx_saved_analyses_user_id ON saved_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_analyses_tool_slug ON saved_analyses(tool_slug);
CREATE INDEX IF NOT EXISTS idx_saved_analyses_favorite ON saved_analyses(is_favorite) WHERE is_favorite = true;

CREATE INDEX IF NOT EXISTS idx_market_data_category ON market_data_cache(category);
CREATE INDEX IF NOT EXISTS idx_market_data_updated ON market_data_cache(last_updated DESC);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE tool_usage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tool_usage_history
CREATE POLICY "Users can view own tool usage history"
  ON tool_usage_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tool usage"
  ON tool_usage_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for saved_analyses
CREATE POLICY "Users can view own saved analyses"
  ON saved_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON saved_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON saved_analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON saved_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for tool_preferences
CREATE POLICY "Users can view own preferences"
  ON tool_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON tool_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON tool_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for market_data_cache (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view market data"
  ON market_data_cache FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for price_alerts
CREATE POLICY "Users can view own price alerts"
  ON price_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price alerts"
  ON price_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own price alerts"
  ON price_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts"
  ON price_alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_tool_usage_history_updated_at
  BEFORE UPDATE ON tool_usage_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_analyses_updated_at
  BEFORE UPDATE ON saved_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tool_preferences_updated_at
  BEFORE UPDATE ON tool_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
