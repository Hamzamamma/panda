-- CREANZA Database Schema (FIXED & IMPROVED for Single Store)
-- Migrated from Prisma schema & Optimized for Supabase RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE product_status AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE product_type AS ENUM ('PHYSICAL', 'DIGITAL');
CREATE TYPE membership_status AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE', 'TRIALING');
CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');
CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
CREATE TYPE broadcast_audience AS ENUM ('ALL_USERS', 'MEMBERS_ONLY', 'BUYERS_ONLY');
CREATE TYPE payout_status AS ENUM ('REQUESTED', 'PAID', 'REJECTED');
CREATE TYPE payout_method AS ENUM ('PAYPAL', 'BANK_TRANSFER', 'STRIPE_CONNECT');
CREATE TYPE team_member_role AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');
CREATE TYPE webhook_status AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- TABLES

-- 1. StoreConfig (Holds the single store's settings)
-- We'll assume a single "owner" user for the platform, linked here.
-- There should ideally be only ONE entry in this table.
CREATE TABLE "StoreConfig" (
    id TEXT PRIMARY KEY DEFAULT 'single_store_config', -- Fixed ID for easy access
    "ownerUserId" UUID NOT NULL UNIQUE, -- The owner of THIS single platform
    "slug" TEXT UNIQUE, -- Optional, if the platform itself has a slug
    theme TEXT DEFAULT 'minimal',
    "primaryColor" TEXT DEFAULT '#000000',
    "fontFamily" TEXT DEFAULT 'Inter',
    "heroTitle" TEXT DEFAULT 'Welcome to my Store',
    "heroDescription" TEXT DEFAULT 'Find the best products here.',
    "heroImage" TEXT,
    "showFeaturedProducts" BOOLEAN DEFAULT TRUE,
    "bioImage" TEXT,
    "bioTitle" TEXT DEFAULT 'My Links',
    "socialLinks" JSONB DEFAULT '{}',
    "customLinks" JSONB DEFAULT '{}',
    currency TEXT DEFAULT 'EUR',
    "taxRate" DECIMAL(5, 2) DEFAULT 0.22,
    "collectTaxes" BOOLEAN DEFAULT FALSE,
    "shippingAddress" TEXT,
    
    -- Integrations
    "shopifyDomain" TEXT,
    "shopifyAccessToken" TEXT,
    "stripeAccountId" TEXT, -- For Stripe Connect (if platform takes payments)
    "stripeCustomerId" TEXT, -- If the owner account itself is a customer of some other service

    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE "Product" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    "compareAtPrice" DECIMAL(10, 2),
    status product_status DEFAULT 'DRAFT',
    type product_type NOT NULL,
    inventory INT DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    "digitalFileUrl" TEXT, -- For digital products
    
    -- External mappings
    "shopifyProductId" TEXT,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,

    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Membership Tiers
CREATE TABLE "MembershipTier" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    benefits TEXT[] DEFAULT '{}',
    status membership_status DEFAULT 'DRAFT',
    
    -- External mappings
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,

    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Subscriptions (Customer Subscribing to the Single Store)
CREATE TABLE "Subscription" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" UUID NOT NULL, -- The customer
    "tierId" TEXT NOT NULL REFERENCES "MembershipTier"(id),
    status subscription_status DEFAULT 'ACTIVE',
    "currentPeriodEnd" TIMESTAMPTZ NOT NULL,
    
    "stripeSubscriptionId" TEXT,

    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Orders (Customer Buying from the Single Store)
CREATE TABLE "Order" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderNumber" SERIAL,
    "userId" UUID, -- Nullable for guest checkout, but links to auth.users if logged in
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'PENDING',
    
    "stripePaymentIntentId" TEXT,
    "stripeSessionId" TEXT,
    "shopifyOrderId" TEXT,

    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Order Items
CREATE TABLE "OrderItem" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    "productId" TEXT NOT NULL REFERENCES "Product"(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 7. Discount Codes
CREATE TABLE "DiscountCode" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    type discount_type NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    uses INT DEFAULT 0,
    "maxUses" INT,
    "expiresAt" TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Broadcasts
CREATE TABLE "Broadcast" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    "targetAudience" broadcast_audience NOT NULL,
    "sentAt" TIMESTAMPTZ DEFAULT NOW(),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payouts (If the platform owner pays themselves from earnings, or similar)
-- In a single-store setup, this might be less complex, possibly just balance transfers.
-- Keeping it for potential future internal accounting.
CREATE TABLE "Payout" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    amount DECIMAL(10, 2) NOT NULL,
    status payout_status DEFAULT 'REQUESTED',
    method payout_method NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Reviews
CREATE TABLE "Review" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" UUID NOT NULL, -- The customer who wrote the review
    "productId" TEXT NOT NULL REFERENCES "Product"(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Team Members (Collaboration for the Single Store)
-- These are team members helping the "ownerUserId" manage the store.
CREATE TABLE "TeamMember" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" UUID NOT NULL UNIQUE, -- The team member's UUID from auth.users
    email TEXT NOT NULL UNIQUE,
    role team_member_role DEFAULT 'VIEWER',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Webhook Events (Audit Log)
CREATE TABLE "WebhookEvent" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    provider TEXT NOT NULL, -- 'STRIPE', 'SHOPIFY'
    "eventId" TEXT NOT NULL,
    type TEXT NOT NULL,
    status webhook_status DEFAULT 'PENDING',
    payload JSONB NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "processedAt" TIMESTAMPTZ
);

-- INDEXES
CREATE INDEX idx_product_status ON "Product"(status);
CREATE INDEX idx_order_customer_email ON "Order"("customerEmail");
CREATE INDEX idx_order_user ON "Order"("userId");
CREATE INDEX idx_subscription_user ON "Subscription"("userId");
CREATE INDEX idx_review_product ON "Review"("productId");

-- ROW LEVEL SECURITY (RLS) - Optimized for Single Store
ALTER TABLE "StoreConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MembershipTier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DiscountCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Broadcast" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebhookEvent" ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is the platform owner
CREATE OR REPLACE FUNCTION is_platform_owner()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM "StoreConfig" WHERE "ownerUserId" = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if the current user is a team member with a specific role
CREATE OR REPLACE FUNCTION is_team_member_with_role(required_role team_member_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM "TeamMember" WHERE "userId" = auth.uid() AND role >= required_role);
$$ LANGUAGE sql SECURITY DEFINER;

-- --- POLICIES ---

-- StoreConfig: Only owner can manage
CREATE POLICY "Owner can view store config" ON "StoreConfig" FOR SELECT USING (is_platform_owner());
CREATE POLICY "Owner can create store config" ON "StoreConfig" FOR INSERT WITH CHECK (is_platform_owner());
CREATE POLICY "Owner can update store config" ON "StoreConfig" FOR UPDATE USING (is_platform_owner());
CREATE POLICY "Owner can delete store config" ON "StoreConfig" FOR DELETE USING (is_platform_owner());

-- Product: Public read, Owner/Admin manage
CREATE POLICY "Public can view active products" ON "Product" FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Owner and Admins can manage products" ON "Product" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- MembershipTier: Public read, Owner/Admin manage
CREATE POLICY "Public can view active membership tiers" ON "MembershipTier" FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Owner and Admins can manage membership tiers" ON "MembershipTier" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- Order: Public can insert (via checkout), Customers view own, Owner/Admin manage
CREATE POLICY "Authenticated users can create orders" ON "Order" FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Customers can view own orders" ON "Order" FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Owner and Admins can manage orders" ON "Order" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- OrderItem: Owner/Admin manage, linked to order policies
CREATE POLICY "Owner and Admins can manage order items" ON "OrderItem" FOR ALL USING (
    EXISTS (SELECT 1 FROM "Order" WHERE "Order".id = "OrderItem"."orderId" AND (is_platform_owner() OR is_team_member_with_role('ADMIN')))
);

-- Subscription: Customers view own, Owner/Admin manage
CREATE POLICY "Customers can view own subscriptions" ON "Subscription" FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Owner and Admins can manage subscriptions" ON "Subscription" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- DiscountCode: Public read for active, Owner/Admin manage
CREATE POLICY "Public can view active discount codes" ON "DiscountCode" FOR SELECT USING (active = TRUE);
CREATE POLICY "Owner and Admins can manage discount codes" ON "DiscountCode" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- Broadcast: Owner/Admin manage
CREATE POLICY "Owner and Admins can manage broadcasts" ON "Broadcast" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- Payout: Owner/Admin manage
CREATE POLICY "Owner and Admins can manage payouts" ON "Payout" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- Review: Customers can create, Public can view, Owner/Admin manage
CREATE POLICY "Customers can create reviews" ON "Review" FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Public can view all reviews" ON "Review" FOR SELECT USING (true);
CREATE POLICY "Owner and Admins can manage reviews" ON "Review" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- TeamMember: Owner/Admin manage their team
CREATE POLICY "Owner and Admins can manage team members" ON "TeamMember" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- WebhookEvent: Only Owner/Admin can view (usually handled server-side)
CREATE POLICY "Owner and Admins can view webhook events" ON "WebhookEvent" FOR ALL USING (
    is_platform_owner() OR is_team_member_with_role('ADMIN')
);

-- Function to auto-update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updatedAt
CREATE TRIGGER update_store_config_updated_at BEFORE UPDATE ON "StoreConfig"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON "Product"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "Order"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_membership_updated_at BEFORE UPDATE ON "MembershipTier"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON "Subscription"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_discount_updated_at BEFORE UPDATE ON "DiscountCode"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_review_updated_at BEFORE UPDATE ON "Review"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_team_member_updated_at BEFORE UPDATE ON "TeamMember"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
