-- ==============================================================================
-- SMARTBANAO POSTGRESQL & SUPABASE DATABASE MIGRATION
-- Migration: 20261019_smartbanao_schema.sql
-- Description: Complete schema for Digital Products, Bundles, Courses, Orders,
--              Payments, Security Policies, and Row Level Security (RLS).
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    product_type TEXT NOT NULL CHECK (product_type IN ('pdf', 'ebook', 'video_course', 'template', 'zip_pack')),
    cover_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    preview_url TEXT,
    file_key TEXT,
    file_size TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price >= 0),
    discount_percent INT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    includes TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. BUNDLES TABLE (One-time digital packages, NO recurring subscriptions)
CREATE TABLE IF NOT EXISTS public.bundles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price >= 0),
    discount_percent INT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    badge TEXT,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. BUNDLE_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.bundle_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(bundle_id, product_id)
);

-- 5. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructor TEXT NOT NULL,
    total_duration_minutes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. COURSE_MODULES TABLE
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. COURSE_LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    duration_seconds INT NOT NULL DEFAULT 0,
    order_index INT NOT NULL DEFAULT 0,
    is_free_preview BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
    gateway_order_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('product', 'bundle')),
    item_id UUID NOT NULL,
    title TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    gateway TEXT NOT NULL CHECK (gateway IN ('razorpay', 'upi', 'test_sandbox')),
    transaction_id TEXT UNIQUE NOT NULL,
    signature TEXT,
    status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'failed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. USER_PRODUCT_ACCESS TABLE
CREATE TABLE IF NOT EXISTS public.user_product_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    access_granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, product_id)
);

-- 12. LESSON_PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT false,
    progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    last_watched_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, lesson_id)
);

-- 13. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    bundle_id UUID REFERENCES public.bundles(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_role TEXT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. SITE_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'SmartBanao',
    tagline TEXT NOT NULL DEFAULT 'Learn Smart. Create More. Achieve More.',
    support_email TEXT NOT NULL DEFAULT 'support@smartbanao.com',
    support_phone TEXT,
    currency TEXT NOT NULL DEFAULT 'INR',
    currency_symbol TEXT NOT NULL DEFAULT '₹',
    promo_banner_enabled BOOLEAN NOT NULL DEFAULT true,
    promo_banner_text TEXT NOT NULL DEFAULT 'Launch Special: Save up to 50% on all digital bundles!',
    promo_banner_expiry TIMESTAMPTZ,
    announcement TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_bundles_slug ON public.bundles(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_access_user_id ON public.user_product_access(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.lesson_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_product_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles RLS
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile except role"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- 2. Products RLS
CREATE POLICY "Anyone can view published products"
    ON public.products FOR SELECT
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Only admins can insert products"
    ON public.products FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update products"
    ON public.products FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete products"
    ON public.products FOR DELETE
    USING (public.is_admin());

-- 3. Bundles RLS
CREATE POLICY "Anyone can view published bundles"
    ON public.bundles FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Only admins can manage bundles"
    ON public.bundles FOR ALL
    USING (public.is_admin());

-- 4. Bundle Items RLS
CREATE POLICY "Anyone can view bundle items"
    ON public.bundle_items FOR SELECT
    TO PUBLIC USING (true);

-- 5. Courses & Lessons RLS
CREATE POLICY "Anyone can view course outline"
    ON public.courses FOR SELECT
    TO PUBLIC USING (true);

CREATE POLICY "Anyone can view modules"
    ON public.course_modules FOR SELECT
    TO PUBLIC USING (true);

CREATE POLICY "Anyone can view preview lessons or lessons if product purchased"
    ON public.course_lessons FOR SELECT
    USING (
      is_free_preview = true OR
      public.is_admin() OR
      EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.user_product_access a ON a.product_id = c.product_id
        WHERE c.id = (SELECT course_id FROM public.course_modules WHERE id = course_lessons.module_id)
        AND a.user_id = auth.uid()
      )
    );

-- 6. Orders & Items RLS
CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create their own pending orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Only server or admin can update order status"
    ON public.orders FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Users can view their order items"
    ON public.order_items FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
      )
    );

-- 7. User Product Access RLS
CREATE POLICY "Users can only read their own access"
    ON public.user_product_access FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- 8. Lesson Progress RLS
CREATE POLICY "Users can manage their own progress"
    ON public.lesson_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 9. Reviews RLS
CREATE POLICY "Anyone can read approved reviews"
    ON public.reviews FOR SELECT
    USING (is_approved = true OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id AND is_approved = false);

CREATE POLICY "Admins can manage all reviews"
    ON public.reviews FOR ALL
    USING (public.is_admin());

-- 10. Site Settings RLS
CREATE POLICY "Anyone can read site settings"
    ON public.site_settings FOR SELECT
    TO PUBLIC USING (true);

CREATE POLICY "Only admins can edit site settings"
    ON public.site_settings FOR UPDATE
    USING (public.is_admin());
