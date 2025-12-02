-- Migration: Create Admin Panel Tables
-- Description: Sets up database schema for admin panel, products management, analytics, and AI integration

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table (migrated from JSON)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  preview_images TEXT[] DEFAULT '{}',
  file_type VARCHAR(50),
  page_count INTEGER,
  file_size_mb DECIMAL(5, 2),
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
  lemon_squeezy_url TEXT,
  lemon_squeezy_product_id VARCHAR(255),
  seo_title VARCHAR(255),
  seo_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_sales_count ON products(sales_count DESC);

-- Product analytics table
CREATE TABLE IF NOT EXISTS product_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  cart_adds INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, date)
);

CREATE INDEX IF NOT EXISTS idx_product_analytics_date ON product_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_product_analytics_product ON product_analytics(product_id);

-- Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user ON product_reviews(user_id);

-- Admin users table (role-based access control)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor', 'support', 'viewer')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category VARCHAR(50),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ai_suggested_response TEXT,
  sentiment_score DECIMAL(3, 2), -- -1.0 to 1.0
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- Support ticket responses
CREATE TABLE IF NOT EXISTS support_ticket_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_responses_ticket ON support_ticket_responses(ticket_id);

-- AI agent logs (for monitoring and improvement)
CREATE TABLE IF NOT EXISTS ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type VARCHAR(50) NOT NULL, -- 'product', 'customer_service', 'sales', 'content', 'analytics'
  action VARCHAR(100) NOT NULL,
  input_data JSONB,
  output_data JSONB,
  model_used VARCHAR(50),
  tokens_used INTEGER,
  cost DECIMAL(10, 6),
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_logs_agent_type ON ai_agent_logs(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON ai_agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user ON ai_agent_logs(user_id);

-- Chat conversations (for customer service AI)
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  ai_agent_type VARCHAR(50) DEFAULT 'customer_service'
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(status);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'ai', 'admin')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Products: Public can read active products, admins can do everything
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.role IN ('super_admin', 'admin', 'editor')
        )
    );

-- Product analytics: Admins can view all, users can view their own product analytics
CREATE POLICY "Admins can view all analytics" ON product_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.role IN ('super_admin', 'admin', 'editor', 'viewer')
        )
    );

-- Product reviews: Users can create and view reviews
CREATE POLICY "Users can view reviews" ON product_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON product_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON product_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin users: Only super admins can manage
CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.role = 'super_admin'
        )
    );

-- Support tickets: Users can view/create their own, admins can view all
CREATE POLICY "Users can view own tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
        AND admin_users.role IN ('super_admin', 'admin', 'support')
    ));

CREATE POLICY "Users can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update tickets" ON support_tickets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.role IN ('super_admin', 'admin', 'support')
        )
    );

-- Chat conversations: Users can view their own, admins can view all
CREATE POLICY "Users can view own conversations" ON chat_conversations
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
        AND admin_users.role IN ('super_admin', 'admin', 'support')
    ));

CREATE POLICY "Users can create conversations" ON chat_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat messages: Users can view messages in their conversations
CREATE POLICY "Users can view conversation messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations
            WHERE chat_conversations.id = chat_messages.conversation_id
            AND (chat_conversations.user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM admin_users
                WHERE admin_users.user_id = auth.uid()
                AND admin_users.role IN ('super_admin', 'admin', 'support')
            ))
        )
    );

CREATE POLICY "Users can send messages" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_conversations
            WHERE chat_conversations.id = chat_messages.conversation_id
            AND chat_conversations.user_id = auth.uid()
        )
    );

-- AI agent logs: Only admins can view
CREATE POLICY "Admins can view AI logs" ON ai_agent_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.role IN ('super_admin', 'admin')
        )
    );

