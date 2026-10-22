export type ProductType = 'pdf' | 'ebook' | 'video_course' | 'template' | 'zip_pack';

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  product_type: ProductType;
  cover_image: string;
  gallery_images?: string[];
  preview_url?: string;
  file_key?: string; // Private storage key
  file_size?: string;
  price: number; // in INR ₹
  original_price?: number;
  discount_percent?: number;
  status: ProductStatus;
  includes?: string[];
  features?: string[];
  created_at: string;
  updated_at: string;
}

export interface Bundle {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  is_published: boolean;
  included_product_ids: string[];
  features?: string[];
  badge?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  video_url: string;
  duration_seconds: number;
  order_index: number;
  is_free_preview: boolean;
  resources?: { name: string; url: string }[];
}

export interface Course {
  id: string;
  product_id: string;
  title: string;
  description: string;
  instructor: string;
  total_duration_minutes: number;
  modules: CourseModule[];
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  item_type: 'product' | 'bundle';
  item_id: string;
  title: string;
  unit_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  gateway_order_id?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payment?: Payment;
}

export interface Payment {
  id: string;
  order_id: string;
  gateway: 'razorpay' | 'upi' | 'test_sandbox';
  transaction_id: string;
  signature?: string;
  status: PaymentStatus;
  created_at: string;
}

export interface UserProductAccess {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string;
  access_granted_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress_percent: number;
  last_watched_at: string;
}

export interface Review {
  id: string;
  product_id?: string;
  bundle_id?: string;
  user_id?: string;
  author_name: string;
  author_role?: string;
  rating: number; // 1-5
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface AdUnitSlot {
  enabled: boolean;
  slot_id: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'responsive';
}

export interface AdSettings {
  master_ads_enabled: boolean;
  ad_free_for_vip: boolean;
  adsense_enabled: boolean;
  adsense_client_id: string;
  adsense_auto_ads: boolean;
  header_ad: AdUnitSlot;
  in_feed_ad: AdUnitSlot;
  footer_ad: AdUnitSlot;
  custom_network_name: string;
  custom_head_script: string;
  custom_infeed_html: string;
  custom_footer_html: string;
  sponsor_ad_enabled: boolean;
  sponsor_title: string;
  sponsor_subtitle: string;
  sponsor_link_url: string;
  sponsor_banner_img: string;
  sponsor_cta: string;
  ads_txt: string;
  analytics: {
    impressions_today: number;
    clicks_today: number;
    ctr_percent: number;
    ecpm_inr: number;
    estimated_revenue_inr: number;
    history: { date: string; impressions: number; clicks: number; revenue: number }[];
  };
}

export interface SiteSettings {
  id: string;
  store_name: string;
  tagline: string;
  support_email: string;
  support_phone?: string;
  currency: string;
  currency_symbol: string;
  promo_banner_enabled: boolean;
  promo_banner_text: string;
  promo_banner_link?: string;
  promo_banner_expiry?: string;
  announcement?: string;
  razorpay_key_id?: string;
  razorpay_configured: boolean;
  payment_gateway?: string;
  manual_upi_id?: string;
  ads?: AdSettings;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}
