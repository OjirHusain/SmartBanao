# Vercel Deployment Guide for SmartBanao

SmartBanao is structured for immediate deployment to Vercel or any standard Node.js / container environment.

---

## 1. Prerequisites

- A [Vercel](https://vercel.com) account.
- A GitHub, GitLab, or Bitbucket repository containing the SmartBanao codebase.
- Provisioned Supabase project and Razorpay gateway credentials.

---

## 2. Deploying via Vercel Dashboard

1. In Vercel, click **Add New...** -> **Project**.
2. Select and import your SmartBanao GitHub repository.
3. Configure Project Settings:
   - **Framework Preset**: `Vite` or `Other`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

---

## 3. Environment Variables Configuration

Add the following environment variables in the Vercel **Environment Variables** panel:

| Variable Name | Environment | Description |
|---|---|---|
| `JWT_SECRET` | Production, Preview | 64-character random string for signing customer sessions |
| `RAZORPAY_KEY_ID` | Production | Razorpay Public Key ID (`rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Production | Razorpay Secret Key |
| `RAZORPAY_WEBHOOK_SECRET` | Production | Secret entered into Razorpay Webhook panel |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Supabase public anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Supabase secret service-role key |

---

## 4. Custom Domain & DNS

1. Go to **Settings** -> **Domains** in your Vercel project.
2. Enter your custom domain (e.g., `smartbanao.com`).
3. Add the corresponding `CNAME` and `A` records at your DNS registrar (GoDaddy, Cloudflare, Namecheap).
4. Vercel automatically generates an SSL certificate within a few minutes.
