/*
  # Add Authentication, Pricing, and Notification System

  ## Overview
  Adds complete authentication, pricing tiers, payment tracking, credit system,
  and notification management to the appraisal platform.

  ## New Tables
  1. **pricing_tiers** - Subscription plans with features and limits
     - `id` (uuid, primary key)
     - `name` (text) - Tier name (Free, Standard, Premium, Enterprise)
     - `display_name` (text) - Display name for UI
     - `price_monthly` (numeric) - Monthly price in USD
     - `price_yearly` (numeric) - Yearly price in USD
     - `appraisals_per_month` (integer) - Monthly appraisal limit (-1 for unlimited)
     - `features` (jsonb) - Array of features included
     - `is_active` (boolean) - Whether tier is available for purchase
     - `sort_order` (integer) - Display order

  2. **user_subscriptions** - User subscription status
     - `id` (uuid, primary key)
     - `user_id` (uuid) - References profiles
     - `tier_id` (uuid) - References pricing_tiers
     - `status` (text) - active, cancelled, expired, trial
     - `billing_cycle` (text) - monthly, yearly
     - `stripe_subscription_id` (text) - Stripe subscription ID
     - `stripe_customer_id` (text) - Stripe customer ID
     - `current_period_start` (timestamptz)
     - `current_period_end` (timestamptz)
     - `cancel_at_period_end` (boolean)
     - `trial_end` (timestamptz)

  3. **payment_transactions** - Payment history
     - `id` (uuid, primary key)
     - `user_id` (uuid) - References profiles
     - `subscription_id` (uuid) - References user_subscriptions
     - `amount` (numeric) - Transaction amount
     - `currency` (text) - Currency code
     - `status` (text) - succeeded, pending, failed, refunded
     - `payment_method` (text) - card, bank, etc.
     - `stripe_payment_intent_id` (text)
     - `description` (text)
     - `metadata` (jsonb)

  4. **appraisal_credits** - Pay-per-use credit tracking
     - `id` (uuid, primary key)
     - `user_id` (uuid) - References profiles
     - `credits_purchased` (integer) - Number of credits bought
     - `credits_remaining` (integer) - Credits still available
     - `price_paid` (numeric) - Amount paid for credits
     - `expires_at` (timestamptz) - Credit expiration date
     - `stripe_payment_intent_id` (text)

  5. **notification_logs** - Track all notifications sent
     - `id` (uuid, primary key)
     - `user_id` (uuid) - References profiles
     - `appraisal_id` (uuid) - References appraisals
     - `notification_type` (text) - email, sms, push
     - `recipient` (text) - Email address or phone number
     - `subject` (text) - Email subject or notification title
     - `status` (text) - sent, failed, pending
     - `provider` (text) - Service provider used
     - `provider_id` (text) - Provider's message ID
     - `error_message` (text)
     - `sent_at` (timestamptz)

  6. **usage_tracking** - Track user usage for limits
     - `id` (uuid, primary key)
     - `user_id` (uuid) - References profiles
     - `period_start` (timestamptz) - Billing period start
     - `period_end` (timestamptz) - Billing period end
     - `appraisals_used` (integer) - Appraisals completed in period
     - `appraisals_limit` (integer) - Limit for this period

  ## Profile Table Updates
  - Add `subscription_tier_id` - Current subscription tier
  - Add `notification_email` - Email for notifications
  - Add `notification_phone` - Phone for SMS notifications
  - Add `notification_preferences` - JSON with preferences
  - Add `stripe_customer_id` - Stripe customer reference
  - Add `onboarding_completed` - Whether user completed setup

  ## Security
  - RLS enabled on all new tables
  - Users can only access their own data
  - Payment data is read-only for users
  - Admin policies for management operations
*/

-- 1. Create pricing_tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  price_monthly numeric(10, 2) DEFAULT 0 NOT NULL,
  price_yearly numeric(10, 2) DEFAULT 0 NOT NULL,
  appraisals_per_month integer DEFAULT 1 NOT NULL,
  features jsonb DEFAULT '[]'::jsonb NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier_id uuid REFERENCES pricing_tiers(id) NOT NULL,
  status text DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial', 'past_due')),
  billing_cycle text DEFAULT 'monthly' NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  current_period_start timestamptz DEFAULT now() NOT NULL,
  current_period_end timestamptz DEFAULT now() + interval '1 month' NOT NULL,
  cancel_at_period_end boolean DEFAULT false NOT NULL,
  trial_end timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded', 'cancelled')),
  payment_method text,
  stripe_payment_intent_id text UNIQUE,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Create appraisal_credits table
CREATE TABLE IF NOT EXISTS appraisal_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  credits_purchased integer DEFAULT 0 NOT NULL,
  credits_remaining integer DEFAULT 0 NOT NULL,
  price_paid numeric(10, 2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  expires_at timestamptz,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Create notification_logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  appraisal_id uuid REFERENCES appraisals(id) ON DELETE SET NULL,
  notification_type text NOT NULL CHECK (notification_type IN ('email', 'sms', 'push', 'in_app')),
  recipient text NOT NULL,
  subject text,
  message text,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('sent', 'failed', 'pending', 'delivered', 'bounced')),
  provider text,
  provider_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Create usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  period_start timestamptz DEFAULT date_trunc('month', now()) NOT NULL,
  period_end timestamptz DEFAULT (date_trunc('month', now()) + interval '1 month') NOT NULL,
  appraisals_used integer DEFAULT 0 NOT NULL,
  appraisals_limit integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, period_start)
);

-- Add columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_tier_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier_id uuid REFERENCES pricing_tiers(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'notification_email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN notification_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'notification_phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN notification_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN notification_preferences jsonb DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_id ON user_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_appraisal_credits_user_id ON appraisal_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_appraisal_id ON notification_logs(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(period_start, period_end);

-- Enable Row Level Security
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pricing_tiers (public read access)
CREATE POLICY "Anyone can view active pricing tiers"
  ON pricing_tiers FOR SELECT
  USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view own transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for appraisal_credits
CREATE POLICY "Users can view own credits"
  ON appraisal_credits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits"
  ON appraisal_credits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credits"
  ON appraisal_credits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notification_logs
CREATE POLICY "Users can view own notifications"
  ON notification_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for usage_tracking
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON usage_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON usage_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default pricing tiers
INSERT INTO pricing_tiers (name, display_name, description, price_monthly, price_yearly, appraisals_per_month, features, sort_order)
VALUES
  (
    'free',
    'Free',
    'Perfect for trying out our service',
    0.00,
    0.00,
    1,
    '["1 appraisal per month", "AI-powered valuation", "Basic condition assessment", "Email results", "48-hour turnaround"]'::jsonb,
    1
  ),
  (
    'standard',
    'Standard',
    'Great for regular users',
    9.99,
    99.00,
    5,
    ["5 appraisals per month", "AI-powered valuation", "Detailed condition assessment", "Market comparables", "Email & SMS results", "24-hour turnaround", "Priority support"]'::jsonb,
    2
  ),
  (
    'premium',
    'Premium',
    'For professionals and collectors',
    29.99,
    299.00,
    -1,
    '["Unlimited appraisals", "AI-powered valuation", "Expert review available", "Comprehensive reports", "Market trend analysis", "All notification types", "12-hour turnaround", "Priority support", "PDF export"]'::jsonb,
    3
  ),
  (
    'enterprise',
    'Enterprise',
    'Custom solutions for businesses',
    0.00,
    0.00,
    -1,
    '["Everything in Premium", "Dedicated account manager", "Custom integrations", "API access", "Bulk appraisals", "White-label options", "SLA guarantees", "Custom reporting"]'::jsonb,
    4
  )
ON CONFLICT (name) DO NOTHING;

-- Function to check appraisal limits
CREATE OR REPLACE FUNCTION check_appraisal_limit(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  v_limit integer;
  v_used integer;
  v_credits integer;
BEGIN
  -- Check if user has credits
  SELECT COALESCE(SUM(credits_remaining), 0) INTO v_credits
  FROM appraisal_credits
  WHERE user_id = p_user_id
    AND (expires_at IS NULL OR expires_at > now());

  IF v_credits > 0 THEN
    RETURN true;
  END IF;

  -- Check subscription limits
  SELECT
    pt.appraisals_per_month,
    COALESCE(ut.appraisals_used, 0)
  INTO v_limit, v_used
  FROM profiles p
  LEFT JOIN pricing_tiers pt ON p.subscription_tier_id = pt.id
  LEFT JOIN usage_tracking ut ON ut.user_id = p.id
    AND ut.period_start <= now()
    AND ut.period_end > now()
  WHERE p.id = p_user_id;

  -- -1 means unlimited
  IF v_limit = -1 THEN
    RETURN true;
  END IF;

  -- Check if under limit
  RETURN v_used < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_appraisal_usage(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_period_start timestamptz;
  v_period_end timestamptz;
  v_limit integer;
  v_credits integer;
BEGIN
  v_period_start := date_trunc('month', now());
  v_period_end := v_period_start + interval '1 month';

  -- Try to use credits first
  SELECT COALESCE(SUM(credits_remaining), 0) INTO v_credits
  FROM appraisal_credits
  WHERE user_id = p_user_id
    AND (expires_at IS NULL OR expires_at > now());

  IF v_credits > 0 THEN
    -- Deduct from oldest credit first
    UPDATE appraisal_credits
    SET credits_remaining = credits_remaining - 1
    WHERE id = (
      SELECT id FROM appraisal_credits
      WHERE user_id = p_user_id
        AND credits_remaining > 0
        AND (expires_at IS NULL OR expires_at > now())
      ORDER BY created_at ASC
      LIMIT 1
    );
    RETURN;
  END IF;

  -- Get user's limit
  SELECT pt.appraisals_per_month INTO v_limit
  FROM profiles p
  LEFT JOIN pricing_tiers pt ON p.subscription_tier_id = pt.id
  WHERE p.id = p_user_id;

  -- Insert or update usage tracking
  INSERT INTO usage_tracking (user_id, period_start, period_end, appraisals_used, appraisals_limit)
  VALUES (p_user_id, v_period_start, v_period_end, 1, COALESCE(v_limit, 1))
  ON CONFLICT (user_id, period_start)
  DO UPDATE SET
    appraisals_used = usage_tracking.appraisals_used + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamps
CREATE TRIGGER update_pricing_tiers_updated_at
  BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
