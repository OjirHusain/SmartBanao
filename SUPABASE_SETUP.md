# Supabase PostgreSQL & Authentication Setup Guide for SmartBanao

This document outlines the exact steps to provision and configure Supabase for SmartBanao in production.

---

## 1. Create a Supabase Project

1. Log in to [supabase.com](https://supabase.com) and click **New project**.
2. Set Project Name to `smartbanao-production`.
3. Choose a secure database password and select the region closest to your target audience (e.g. `ap-south-1` Mumbai, India).
4. Wait approximately 1–2 minutes for the database instance to initialize.

---

## 2. Execute SQL Database Migrations

1. In your Supabase dashboard, navigate to the **SQL Editor** tab on the left sidebar.
2. Click **New query**.
3. Copy the entire contents of `supabase/migrations/20261019_smartbanao_schema.sql`.
4. Paste the SQL into the editor and click **Run**.
5. Verify that all 14 tables and Row Level Security policies are generated:
   - `profiles`
   - `products`
   - `bundles`
   - `bundle_items`
   - `courses`
   - `course_modules`
   - `course_lessons`
   - `orders`
   - `order_items`
   - `payments`
   - `user_product_access`
   - `lesson_progress`
   - `reviews`
   - `site_settings`

---

## 3. Storage Bucket Configuration (Private Downloads)

SmartBanao uses private storage buckets with time-limited signed URLs so that raw PDF and ZIP files are never publicly leaked.

1. Navigate to **Storage** in the Supabase Dashboard.
2. Click **New bucket**.
3. Set the bucket name to `smartbanao-private-downloads`.
4. **CRITICAL**: Ensure **Public bucket** is toggled **OFF** (Keep private).
5. Under Bucket Policies, verify that read access is restricted to authenticated users with active records in `user_product_access`.

---

## 4. Authentication Configuration

1. In the Supabase Dashboard, navigate to **Authentication** -> **Providers**.
2. Verify **Email** is enabled.
3. To enable Google or GitHub 1-click social logins:
   - Toggle **Google** or **GitHub** and enter OAuth credentials from Google Cloud Console or GitHub Developer Settings.
4. Set Site URL to your domain (e.g., `https://smartbanao.vercel.app` or custom domain).
5. In **URL Configuration**, add redirect URLs:
   - `https://your-domain.com/**`
   - `http://localhost:3000/**`

---

## 5. Environment Variables in `.env`

Copy your project credentials from **Project Settings -> API**:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"
DATABASE_URL="postgresql://postgres:your-db-pass@db.your-project.supabase.co:5432/postgres"
```
