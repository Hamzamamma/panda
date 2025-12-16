-- CREANZA Database Schema
-- Migrated from Prisma schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE product_status AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE product_type AS ENUM ('PHYSICAL', 'DIGITAL');
CREATE TYPE membership_status AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE');
CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
CREATE TYPE broadcast_audience AS ENUM ('ALL_USERS', 'MEMBERS_ONLY', 'BUYERS_ONLY');
CREATE TYPE payout_status AS ENUM ('REQUESTED', 'PAID', 'REJECTED');
CREATE TYPE payout_method AS ENUM ('PAYPAL', 'BANK_TRANSFER');
CREATE TYPE team_member_role AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- TABLES

-- Products
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
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Membership Tiers
CREATE TABLE "MembershipTier" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    benefits TEXT[] DEFAULT '{}',
    status membership_status DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE "Subscription" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL REFERENCES "MembershipTier"(id),
    status subscription_status DEFAULT 'ACTIVE',
    "currentPeriodEnd" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Store Config
CREATE TABLE "StoreConfig" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT UNIQUE,
    theme TEXT DEFAULT 'minimal',
    "primaryColor" TEXT DEFAULT '#000000',
    "fontFamily" TEXT DEFAULT 'Inter',
    "heroTitle" TEXT DEFAULT 'Welcome to my Store',
    "heroDescription" TEXT DEFAULT 'Find the best products here.',
    "heroImage" TEXT,
    "showFeaturedProducts" BOOLEAN DEFAULT TRUE,
    "bioImage" TEXT,
    "bioTitle" TEXT DEFAULT 'My Links',
    "socialLinks" JSONB,
    "customLinks" JSONB,
    currency TEXT DEFAULT 'EUR',
    "taxRate" DECIMAL(5, 2) DEFAULT 0.22,
    "collectTaxes" BOOLEAN DEFAULT FALSE,
    "shippingAddress" TEXT,
    "shopifyDomain" TEXT,
    "shopifyAccessToken" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE "Order" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderNumber" SERIAL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE "OrderItem" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    "productId" TEXT NOT NULL REFERENCES "Product"(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Discount Codes
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

-- Broadcasts
CREATE TABLE "Broadcast" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    "targetAudience" broadcast_audience NOT NULL,
    "sentAt" TIMESTAMPTZ DEFAULT NOW(),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Payouts
CREATE TABLE "Payout" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    amount DECIMAL(10, 2) NOT NULL,
    status payout_status DEFAULT 'REQUESTED',
    method payout_method NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Balance
CREATE TABLE "Balance" (
    id TEXT PRIMARY KEY,
    "availableAmount" DECIMAL(10, 2) DEFAULT 0,
    "pendingAmount" DECIMAL(10, 2) DEFAULT 0,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (id) REFERENCES "StoreConfig"(id)
);

-- Reviews
CREATE TABLE "Review" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL REFERENCES "Product"(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE "TeamMember" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role team_member_role DEFAULT 'VIEWER',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_product_status ON "Product"(status);
CREATE INDEX idx_order_status ON "Order"(status);
CREATE INDEX idx_order_customer_email ON "Order"("customerEmail");
CREATE INDEX idx_subscription_user ON "Subscription"("userId");
CREATE INDEX idx_review_product ON "Review"("productId");

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MembershipTier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StoreConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DiscountCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Broadcast" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Balance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;

-- Public read policies for products (storefront)
CREATE POLICY "Products are viewable by everyone" ON "Product"
    FOR SELECT USING (status = 'ACTIVE');

-- Public read for membership tiers
CREATE POLICY "Active memberships viewable by everyone" ON "MembershipTier"
    FOR SELECT USING (status = 'ACTIVE');

-- Authenticated users can manage their own data
CREATE POLICY "Users can view own subscriptions" ON "Subscription"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can view own orders" ON "Order"
    FOR SELECT USING (auth.uid()::text = "customerEmail");

CREATE POLICY "Users can create reviews" ON "Review"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can view all reviews" ON "Review"
    FOR SELECT USING (true);

-- Function to auto-update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updatedAt
CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON "Product"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "Order"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_membership_updated_at BEFORE UPDATE ON "MembershipTier"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON "Subscription"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_store_config_updated_at BEFORE UPDATE ON "StoreConfig"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_discount_updated_at BEFORE UPDATE ON "DiscountCode"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_review_updated_at BEFORE UPDATE ON "Review"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_team_member_updated_at BEFORE UPDATE ON "TeamMember"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
