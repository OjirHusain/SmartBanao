import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  Product,
  Bundle,
  Course,
  CourseModule,
  CourseLesson,
  Order,
  OrderItem,
  Payment,
  UserProductAccess,
  LessonProgress,
  Review,
  SiteSettings,
  UserProfile,
} from '../src/types/index.ts';

const DB_FILE = path.join(process.cwd(), '.smartbanao-data.json');

export interface StoredUser extends UserProfile {
  password_hash: string;
}

export interface DatabaseState {
  users: StoredUser[];
  products: Product[];
  bundles: Bundle[];
  courses: Course[];
  orders: Order[];
  payments: Payment[];
  access: UserProductAccess[];
  progress: LessonProgress[];
  reviews: Review[];
  settings: SiteSettings;
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'site_settings_default',
  store_name: 'SmartBanao',
  tagline: 'Tools for Curious Builders',
  support_email: 'support@smartbanao.com',
  support_phone: '',
  currency: 'INR',
  currency_symbol: '₹',
  promo_banner_enabled: true,
  promo_banner_text: 'A little more progress, for a little less. One-time purchases · No subscriptions',
  announcement: 'Thoughtfully made digital guides, practical courses and creator resources.',
  razorpay_key_id: process.env.RAZORPAY_KEY_ID || '',
  razorpay_configured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  ads: {
    master_ads_enabled: true,
    ad_free_for_vip: true,
    adsense_enabled: true,
    adsense_client_id: 'ca-pub-6849204819402847',
    adsense_auto_ads: false,
    header_ad: {
      enabled: true,
      slot_id: '9284019284',
      format: 'horizontal',
    },
    in_feed_ad: {
      enabled: true,
      slot_id: '4820194829',
      format: 'responsive',
    },
    footer_ad: {
      enabled: true,
      slot_id: '1039482910',
      format: 'horizontal',
    },
    custom_network_name: 'Media.net / Custom Network',
    custom_head_script: '',
    custom_infeed_html: '',
    custom_footer_html: '',
    sponsor_ad_enabled: true,
    sponsor_title: 'Cloud VPS & Pro Hosting for Creators',
    sponsor_subtitle: 'Deploy full-stack React, Node & Next.js projects with 99.99% uptime and zero setup fees.',
    sponsor_link_url: 'https://smartbanao.com',
    sponsor_banner_img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80',
    sponsor_cta: 'Explore Special Offer',
    ads_txt: `google.com, pub-6849204819402847, DIRECT, f08c47fec0942fa0\n# SmartBanao Authorized Ad Sellers\nmedia.net, 8C2749, DIRECT`,
    analytics: {
      impressions_today: 14280,
      clicks_today: 432,
      ctr_percent: 3.02,
      ecpm_inr: 85.50,
      estimated_revenue_inr: 1220.94,
      history: [
        { date: 'Oct 14', impressions: 11200, clicks: 310, revenue: 958 },
        { date: 'Oct 15', impressions: 12450, clicks: 360, revenue: 1064 },
        { date: 'Oct 16', impressions: 13100, clicks: 395, revenue: 1120 },
        { date: 'Oct 17', impressions: 14000, clicks: 420, revenue: 1197 },
        { date: 'Oct 18', impressions: 13800, clicks: 410, revenue: 1180 },
        { date: 'Oct 19', impressions: 14280, clicks: 432, revenue: 1221 },
      ],
    },
  },
};

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_smartbanao_salt').digest('hex');
}

// Exactly matching the products shown in the screenshot
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-content-obsession',
    title: 'Content Obsession',
    slug: 'content-obsession',
    description: 'A practical prompt guide for planning more intentional content, clarifying your voice, and publishing without burnout.',
    short_description: 'A practical prompt guide for planning more intentional content.',
    product_type: 'ebook',
    cover_image: '',
    price: 79,
    original_price: 399,
    discount_percent: 80,
    status: 'published',
    file_size: '18 MB PDF',
    includes: [
      'The Creator’s Field Guide (PDF)',
      'SmartBanao Editions 01 / PDF',
      '12 min read actionable prompts',
      'Editorial planning worksheet',
    ],
    features: [
      'Clean typography optimized for mobile & tablet reading',
      'No unnecessary noise or marketing jargon',
      'Instant encrypted PDF download',
    ],
    created_at: new Date('2026-01-10').toISOString(),
    updated_at: new Date('2026-03-01').toISOString(),
  },
  {
    id: 'prod-creators-planning-kit',
    title: 'Creator’s Planning Kit',
    slug: 'creators-planning-kit',
    description: 'Organise ideas, plan your week, and make the next step obvious. Reusable worksheets for modern independent workers.',
    short_description: 'Organise ideas, plan your week and make the next step obvious.',
    product_type: 'template',
    cover_image: '',
    price: 99,
    original_price: 499,
    discount_percent: 80,
    status: 'published',
    file_size: '24 MB PDF + Notion Template',
    includes: [
      'A Calmer Workflow Worksheet Collection',
      'Reusable weekly agenda matrices',
      'Print-ready PDF & Notion dashboard',
      'Commercial usage license',
    ],
    features: [
      'Printable and tablet-compatible layout',
      'Distraction-free planning frameworks',
      'Immediate access in library',
    ],
    created_at: new Date('2026-01-15').toISOString(),
    updated_at: new Date('2026-03-05').toISOString(),
  },
  {
    id: 'prod-digital-skills-simplified',
    title: 'Digital Skills, Simplified',
    slug: 'digital-skills-simplified',
    description: 'A no-jargon introduction to useful digital skills, tools, and workflows designed specifically for beginners taking their first steps.',
    short_description: 'A no-jargon introduction to useful digital skills and tools.',
    product_type: 'ebook',
    cover_image: '',
    price: 59,
    original_price: 299,
    discount_percent: 80,
    status: 'published',
    file_size: '14 MB PDF',
    includes: [
      'Start Where You Are: Beginner Series 03',
      'Curated digital tool stack guide',
      'Step-by-step setup checklists',
    ],
    features: [
      'Simple language free from technical fluff',
      'Lifetime updates for upcoming editions',
      'Direct mobile download',
    ],
    created_at: new Date('2026-01-20').toISOString(),
    updated_at: new Date('2026-03-10').toISOString(),
  },
  {
    id: 'prod-build-first-digital-product',
    title: 'Build Your First Digital Product',
    slug: 'build-first-digital-product',
    description: 'A focused video walkthrough from rough idea to a finished first version. Learn how to outline, package, and launch digital assets.',
    short_description: 'A focused walkthrough from rough idea to a finished first version.',
    product_type: 'video_course',
    cover_image: '',
    price: 199,
    original_price: 799,
    discount_percent: 75,
    status: 'published',
    file_size: 'Video Workshop 04 / Video',
    includes: [
      'Learn By Doing: Self-Paced Video Workshop',
      '4 In-Depth Video Walkthrough Modules',
      'Downloadable packaging checklist & templates',
      'Verifiable Certificate of Completion',
    ],
    features: [
      'HD streaming video player with speed controls',
      'Free preview lesson included',
      'Lifetime digital license',
    ],
    created_at: new Date('2026-02-01').toISOString(),
    updated_at: new Date('2026-03-12').toISOString(),
  },
  {
    id: 'prod-launch-kit',
    title: 'Digital Product Launch Kit',
    slug: 'digital-product-launch-kit',
    description: 'Keep the essential launch tasks together in one tidy checklist. A small launch plan designed so you are ready whenever you are.',
    short_description: 'Keep the essential launch tasks together in one tidy checklist.',
    product_type: 'pdf',
    cover_image: '',
    price: 89,
    original_price: 349,
    discount_percent: 74,
    status: 'published',
    file_size: '12 MB PDF Checklist',
    includes: [
      'A Small Launch Plan: Launch Toolkit 05 / PDF',
      'Pre-launch verification checklist',
      'Announcement script templates',
    ],
    features: [
      'Quick-start implementation format',
      'Zero unnecessary steps',
      'Instant download',
    ],
    created_at: new Date('2026-02-05').toISOString(),
    updated_at: new Date('2026-03-15').toISOString(),
  },
  {
    id: 'prod-idea-to-action-workbook',
    title: 'The Idea-to-Action Workbook',
    slug: 'idea-to-action-workbook',
    description: 'Prompts to sort your thoughts and turn one idea into a plan. Structured reflective prompts that bring clarity and momentum.',
    short_description: 'Prompts to sort your thoughts and turn one idea into a plan.',
    product_type: 'pdf',
    cover_image: '',
    price: 69,
    original_price: 299,
    discount_percent: 77,
    status: 'published',
    file_size: '16 MB PDF Workbook',
    includes: [
      'A Little Clarity: Idea Workbook 06 / PDF',
      'Structured thinking exercises',
      'Printable action roadmap',
    ],
    features: [
      'Printable & tablet friendly',
      'No subscriptions · Keep forever',
      'Instant access in your library',
    ],
    created_at: new Date('2026-02-10').toISOString(),
    updated_at: new Date('2026-03-18').toISOString(),
  },
];

// Bundles matching the screenshot: Plan A and Plan B
const INITIAL_BUNDLES: Bundle[] = [
  {
    id: 'bundle-plan-a',
    title: 'Plan A — The Starter Set',
    slug: 'plan-a-starter-set',
    description: 'Useful foundations, simple frameworks and resources to help you take the first step with confidence.',
    cover_image: '',
    price: 79,
    original_price: 399,
    discount_percent: 80,
    is_published: true,
    badge: 'THE ESSENTIALS',
    included_product_ids: [
      'prod-content-obsession',
      'prod-digital-skills-simplified',
      'prod-idea-to-action-workbook',
    ],
    features: [
      'Includes 3 Core Foundations Guides',
      'Start Here + The Workbook included',
      'One-time payment · Lifetime access',
      'Instant access in My Library',
    ],
    created_at: new Date('2026-02-10').toISOString(),
    updated_at: new Date('2026-03-15').toISOString(),
  },
  {
    id: 'bundle-plan-b',
    title: 'Plan B — The Complete Set',
    slug: 'plan-b-complete-set',
    description: 'A broader toolkit for people ready to go deeper, with more guides and ready-to-use resources.',
    cover_image: '',
    price: 149,
    original_price: 699,
    discount_percent: 78,
    is_published: true,
    badge: 'MORE ROOM TO GROW',
    included_product_ids: [
      'prod-content-obsession',
      'prod-creators-planning-kit',
      'prod-digital-skills-simplified',
      'prod-build-first-digital-product',
      'prod-launch-kit',
      'prod-idea-to-action-workbook',
    ],
    features: [
      'All 6 Products & Video Workshops Included',
      'The Playbook + Go Further modules',
      'Comprehensive ready-to-use toolkit',
      'Massive package savings · Pay once, keep forever',
    ],
    created_at: new Date('2026-02-12').toISOString(),
    updated_at: new Date('2026-03-18').toISOString(),
  },
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-build-digital-product',
    product_id: 'prod-build-first-digital-product',
    title: 'Build Your First Digital Product',
    description: 'A focused walkthrough from rough idea to a finished first version.',
    instructor: 'SmartBanao Creator Team',
    total_duration_minutes: 180,
    modules: [
      {
        id: 'mod-1',
        course_id: 'course-build-digital-product',
        title: 'Module 1: Defining a High-Utility Idea',
        order_index: 1,
        lessons: [
          {
            id: 'les-1-1',
            module_id: 'mod-1',
            title: '1. Finding the Signal: What People Actually Pay For',
            description: 'Why focused, compact guides outperform bloated 50-hour courses.',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration_seconds: 640,
            order_index: 1,
            is_free_preview: true,
          },
          {
            id: 'les-1-2',
            module_id: 'mod-1',
            title: '2. Structuring Your Framework into Tidy Sections',
            description: 'Organising the table of contents and worksheets for zero cognitive load.',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration_seconds: 820,
            order_index: 2,
            is_free_preview: false,
          },
        ],
      },
      {
        id: 'mod-2',
        course_id: 'course-build-digital-product',
        title: 'Module 2: Packaging & Delivering with Dignity',
        order_index: 2,
        lessons: [
          {
            id: 'les-2-1',
            module_id: 'mod-2',
            title: '3. Clean Layouts, PDF Exporting & Asset Design',
            description: 'Creating minimalist, distraction-free visual assets that people love opening.',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration_seconds: 940,
            order_index: 1,
            is_free_preview: false,
          },
          {
            id: 'les-2-2',
            module_id: 'mod-2',
            title: '4. Instant Checkout, UPI Setup & Delivering to Library',
            description: 'Setting up clean one-time checkout and automated digital fulfillment.',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration_seconds: 1100,
            order_index: 2,
            is_free_preview: false,
          },
        ],
      },
    ],
  },
];

// Exact reviews matching the screenshot
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author_name: 'Review example',
    author_role: 'Replace with a verified customer',
    rating: 5,
    comment: 'I finally had a clear place to start instead of saving another hundred tips.',
    is_approved: true,
    created_at: new Date('2026-03-01').toISOString(),
  },
  {
    id: 'rev-2',
    author_name: 'Review example',
    author_role: 'Replace with a verified customer',
    rating: 5,
    comment: 'Simple to follow, and I could put the steps to use straight away.',
    is_approved: true,
    created_at: new Date('2026-03-08').toISOString(),
  },
  {
    id: 'rev-3',
    author_name: 'Review example',
    author_role: 'Replace with a verified customer',
    rating: 5,
    comment: 'I liked that it focused on the useful bits without making things complicated.',
    is_approved: true,
    created_at: new Date('2026-03-14').toISOString(),
  },
];

class MemoryDatabase {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    const defaultAdmin: StoredUser = {
      id: 'user-admin-default',
      email: 'admin@smartbanao.com',
      full_name: 'SmartBanao Administrator',
      phone: '',
      role: 'admin',
      password_hash: hashPassword('admin123'),
      created_at: new Date('2026-01-01').toISOString(),
    };

    const defaultLearner: StoredUser = {
      id: 'user-learner-demo',
      email: 'learner@smartbanao.com',
      full_name: 'Library Member',
      phone: '',
      role: 'customer',
      password_hash: hashPassword('learner123'),
      created_at: new Date('2026-02-01').toISOString(),
    };

    const initialAccess: UserProductAccess[] = [
      {
        id: 'acc-1',
        user_id: defaultLearner.id,
        product_id: 'prod-content-obsession',
        order_id: 'order-demo-1',
        access_granted_at: new Date('2026-02-15').toISOString(),
      },
      {
        id: 'acc-2',
        user_id: defaultLearner.id,
        product_id: 'prod-digital-skills-simplified',
        order_id: 'order-demo-1',
        access_granted_at: new Date('2026-02-15').toISOString(),
      },
    ];

    const initialOrders: Order[] = [
      {
        id: 'order-demo-1',
        order_number: 'SB-2026-0042',
        user_id: defaultLearner.id,
        customer_email: defaultLearner.email,
        customer_name: defaultLearner.full_name,
        customer_phone: '',
        total_amount: 79,
        currency: 'INR',
        status: 'paid',
        gateway_order_id: 'order_test_demo_0042',
        created_at: new Date('2026-02-15T10:30:00Z').toISOString(),
        updated_at: new Date('2026-02-15T10:32:00Z').toISOString(),
        items: [
          {
            id: 'item-demo-1',
            order_id: 'order-demo-1',
            item_type: 'bundle',
            item_id: 'bundle-plan-a',
            title: 'Plan A — The Starter Set',
            unit_price: 79,
          },
        ],
        payment: {
          id: 'pay-demo-1',
          order_id: 'order-demo-1',
          gateway: 'test_sandbox',
          transaction_id: 'pay_test_0042_verified',
          status: 'verified',
          created_at: new Date('2026-02-15T10:32:00Z').toISOString(),
        },
      },
    ];

    const state: DatabaseState = {
      users: [defaultAdmin, defaultLearner],
      products: INITIAL_PRODUCTS,
      bundles: INITIAL_BUNDLES,
      courses: INITIAL_COURSES,
      orders: initialOrders,
      payments: [initialOrders[0].payment!],
      access: initialAccess,
      progress: [],
      reviews: INITIAL_REVIEWS,
      settings: DEFAULT_SETTINGS,
    };

    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (parsed.products && parsed.products.length > 0) {
          // Sync catalog & clean settings
          parsed.products = INITIAL_PRODUCTS;
          parsed.bundles = INITIAL_BUNDLES;
          parsed.courses = INITIAL_COURSES;
          parsed.reviews = INITIAL_REVIEWS;
          parsed.settings = {
            ...DEFAULT_SETTINGS,
            ...(parsed.settings || {}),
            support_phone: '',
            ads: parsed.settings?.ads || DEFAULT_SETTINGS.ads,
          };
          this.saveState(parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read db file, initializing with defaults');
    }

    this.saveState(state);
    return state;
  }

  private saveState(state: DatabaseState) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving db file', e);
    }
  }

  // --- Auth / User Operations ---
  public findUserByEmail(email: string): StoredUser | undefined {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): StoredUser | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  public createUser(userData: {
    email: string;
    full_name: string;
    phone?: string;
    password: string;
    role?: 'customer' | 'admin';
  }): UserProfile {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: StoredUser = {
      id: 'usr_' + crypto.randomUUID().slice(0, 12),
      email: userData.email.toLowerCase().trim(),
      full_name: userData.full_name.trim(),
      phone: userData.phone?.trim() || '',
      role: userData.role || 'customer',
      password_hash: hashPassword(userData.password),
      created_at: new Date().toISOString(),
    };

    this.state.users.push(newUser);
    this.saveState(this.state);

    const { password_hash, ...profile } = newUser;
    return profile;
  }

  public verifyCredentials(email: string, password: string): UserProfile | null {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    const computedHash = hashPassword(password);
    if (user.password_hash !== computedHash) return null;

    const { password_hash, ...profile } = user;
    return profile;
  }

  public updatePassword(email: string, newPass: string): boolean {
    const user = this.findUserByEmail(email);
    if (!user) return false;
    user.password_hash = hashPassword(newPass);
    this.saveState(this.state);
    return true;
  }

  public getAllUsers(): UserProfile[] {
    return this.state.users.map(({ password_hash, ...profile }) => profile);
  }

  // --- Products ---
  public getProducts(options?: { publishedOnly?: boolean }): Product[] {
    if (options?.publishedOnly) {
      return this.state.products.filter((p) => p.status === 'published');
    }
    return this.state.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.state.products.find((p) => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.state.products.find((p) => p.slug === slug);
  }

  public saveProduct(product: Partial<Product> & { title: string; price: number; product_type: Product['product_type'] }): Product {
    const now = new Date().toISOString();
    if (product.id) {
      const idx = this.state.products.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        this.state.products[idx] = {
          ...this.state.products[idx],
          ...product,
          updated_at: now,
        };
        this.saveState(this.state);
        return this.state.products[idx];
      }
    }

    const slug = product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      id: 'prod_' + crypto.randomUUID().slice(0, 10),
      title: product.title,
      slug,
      description: product.description || '',
      short_description: product.short_description || '',
      product_type: product.product_type,
      cover_image: product.cover_image || '',
      price: Math.max(0, Number(product.price)),
      original_price: product.original_price ? Number(product.original_price) : undefined,
      discount_percent: product.discount_percent,
      status: product.status || 'published',
      file_size: product.file_size,
      includes: product.includes || [],
      features: product.features || [],
      created_at: now,
      updated_at: now,
    };

    this.state.products.push(newProduct);
    this.saveState(this.state);
    return newProduct;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.state.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.state.products.splice(idx, 1);
    this.saveState(this.state);
    return true;
  }

  // --- Bundles ---
  public getBundles(options?: { publishedOnly?: boolean }): Bundle[] {
    if (options?.publishedOnly) {
      return this.state.bundles.filter((b) => b.is_published);
    }
    return this.state.bundles;
  }

  public getBundleById(id: string): Bundle | undefined {
    return this.state.bundles.find((b) => b.id === id);
  }

  public getBundleBySlug(slug: string): Bundle | undefined {
    return this.state.bundles.find((b) => b.slug === slug);
  }

  public saveBundle(bundleData: Partial<Bundle> & { title: string; price: number; included_product_ids: string[] }): Bundle {
    const now = new Date().toISOString();
    if (bundleData.id) {
      const idx = this.state.bundles.findIndex((b) => b.id === bundleData.id);
      if (idx !== -1) {
        this.state.bundles[idx] = {
          ...this.state.bundles[idx],
          ...bundleData,
          updated_at: now,
        };
        this.saveState(this.state);
        return this.state.bundles[idx];
      }
    }

    const slug = bundleData.slug || bundleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBundle: Bundle = {
      id: 'bundle_' + crypto.randomUUID().slice(0, 10),
      title: bundleData.title,
      slug,
      description: bundleData.description || '',
      cover_image: bundleData.cover_image || '',
      price: Math.max(0, Number(bundleData.price)),
      original_price: bundleData.original_price ? Number(bundleData.original_price) : undefined,
      discount_percent: bundleData.discount_percent,
      is_published: bundleData.is_published ?? true,
      included_product_ids: bundleData.included_product_ids || [],
      features: bundleData.features || [],
      badge: bundleData.badge || '',
      created_at: now,
      updated_at: now,
    };

    this.state.bundles.push(newBundle);
    this.saveState(this.state);
    return newBundle;
  }

  public deleteBundle(id: string): boolean {
    const idx = this.state.bundles.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.state.bundles.splice(idx, 1);
    this.saveState(this.state);
    return true;
  }

  // --- Courses ---
  public getCourses(): Course[] {
    return this.state.courses;
  }

  public getCourseByProductId(productId: string): Course | undefined {
    return this.state.courses.find((c) => c.product_id === productId);
  }

  public getCourseById(courseId: string): Course | undefined {
    return this.state.courses.find((c) => c.id === courseId);
  }

  public saveCourse(course: Course): Course {
    const idx = this.state.courses.findIndex((c) => c.id === course.id);
    if (idx !== -1) {
      this.state.courses[idx] = course;
    } else {
      this.state.courses.push(course);
    }
    this.saveState(this.state);
    return course;
  }

  // --- User Product Access ---
  public getUserAccess(userId: string): string[] {
    return this.state.access.filter((a) => a.user_id === userId).map((a) => a.product_id);
  }

  public hasAccess(userId: string, productId: string): boolean {
    return this.state.access.some((a) => a.user_id === userId && a.product_id === productId);
  }

  public grantAccess(userId: string, productIds: string[], orderId: string): void {
    const now = new Date().toISOString();
    for (const pid of productIds) {
      if (!this.hasAccess(userId, pid)) {
        this.state.access.push({
          id: 'acc_' + crypto.randomUUID().slice(0, 10),
          user_id: userId,
          product_id: pid,
          order_id: orderId,
          access_granted_at: now,
        });
      }
    }
    this.saveState(this.state);
  }

  // --- Orders & Payments ---
  public createOrder(data: {
    userId: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    items: { itemType: 'product' | 'bundle'; itemId: string }[];
  }): { order: Order; totalAmount: number } {
    let calculatedTotal = 0;
    const orderItems: OrderItem[] = [];
    const orderId = 'ord_' + crypto.randomUUID().slice(0, 12);

    for (const item of data.items) {
      if (item.itemType === 'product') {
        const product = this.getProductById(item.itemId);
        if (!product || product.status !== 'published') {
          throw new Error(`Product not found or unavailable: ${item.itemId}`);
        }
        calculatedTotal += product.price;
        orderItems.push({
          id: 'item_' + crypto.randomUUID().slice(0, 10),
          order_id: orderId,
          item_type: 'product',
          item_id: product.id,
          title: product.title,
          unit_price: product.price,
        });
      } else if (item.itemType === 'bundle') {
        const bundle = this.getBundleById(item.itemId);
        if (!bundle || !bundle.is_published) {
          throw new Error(`Bundle not found or unavailable: ${item.itemId}`);
        }
        calculatedTotal += bundle.price;
        orderItems.push({
          id: 'item_' + crypto.randomUUID().slice(0, 10),
          order_id: orderId,
          item_type: 'bundle',
          item_id: bundle.id,
          title: bundle.title,
          unit_price: bundle.price,
        });
      }
    }

    const orderNumber = `SB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const order: Order = {
      id: orderId,
      order_number: orderNumber,
      user_id: data.userId,
      customer_email: data.customerEmail,
      customer_name: data.customerName,
      customer_phone: data.customerPhone || '',
      total_amount: calculatedTotal,
      currency: 'INR',
      status: 'pending',
      created_at: now,
      updated_at: now,
      items: orderItems,
    };

    this.state.orders.unshift(order);
    this.saveState(this.state);

    return { order, totalAmount: calculatedTotal };
  }

  public getOrderById(id: string): Order | undefined {
    return this.state.orders.find((o) => o.id === id);
  }

  public getOrdersByUserId(userId: string): Order[] {
    return this.state.orders.filter((o) => o.user_id === userId);
  }

  public getAllOrders(): Order[] {
    return this.state.orders;
  }

  public markOrderPaid(orderId: string, paymentDetails: { gateway: 'razorpay' | 'upi' | 'test_sandbox'; transactionId: string; signature?: string }): { order: Order; newlyGrantedProductIds: string[] } {
    const order = this.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    if (order.status === 'paid') {
      return { order, newlyGrantedProductIds: [] };
    }

    const now = new Date().toISOString();
    order.status = 'paid';
    order.updated_at = now;

    const payment: Payment = {
      id: 'pay_' + crypto.randomUUID().slice(0, 10),
      order_id: order.id,
      gateway: paymentDetails.gateway,
      transaction_id: paymentDetails.transactionId,
      signature: paymentDetails.signature,
      status: 'verified',
      created_at: now,
    };

    order.payment = payment;
    this.state.payments.push(payment);

    const productIdsToGrant: string[] = [];
    if (order.items) {
      for (const item of order.items) {
        if (item.item_type === 'product') {
          productIdsToGrant.push(item.item_id);
        } else if (item.item_type === 'bundle') {
          const bundle = this.getBundleById(item.item_id);
          if (bundle) {
            productIdsToGrant.push(...bundle.included_product_ids);
          }
        }
      }
    }

    this.grantAccess(order.user_id, productIdsToGrant, order.id);
    this.saveState(this.state);

    return { order, newlyGrantedProductIds: productIdsToGrant };
  }

  // --- Reviews ---
  public getReviews(options?: { approvedOnly?: boolean }): Review[] {
    if (options?.approvedOnly) {
      return this.state.reviews.filter((r) => r.is_approved);
    }
    return this.state.reviews;
  }

  public addReview(review: Omit<Review, 'id' | 'created_at' | 'is_approved'> & { is_approved?: boolean }): Review {
    const newRev: Review = {
      id: 'rev_' + crypto.randomUUID().slice(0, 10),
      ...review,
      is_approved: review.is_approved ?? false,
      created_at: new Date().toISOString(),
    };
    this.state.reviews.unshift(newRev);
    this.saveState(this.state);
    return newRev;
  }

  public moderateReview(reviewId: string, approved: boolean): boolean {
    const rev = this.state.reviews.find((r) => r.id === reviewId);
    if (!rev) return false;
    rev.is_approved = approved;
    this.saveState(this.state);
    return true;
  }

  // --- Progress Tracking ---
  public getLessonProgress(userId: string, courseId: string): LessonProgress[] {
    const course = this.getCourseById(courseId);
    if (!course) return [];
    const lessonIds = new Set<string>();
    for (const mod of course.modules) {
      for (const les of mod.lessons) {
        lessonIds.add(les.id);
      }
    }
    return (this.state.progress || []).filter((p) => p.user_id === userId && lessonIds.has(p.lesson_id));
  }

  public updateLessonProgress(userId: string, lessonId: string, completed: boolean, progressPercent: number): LessonProgress {
    const now = new Date().toISOString();
    if (!this.state.progress) this.state.progress = [];
    let prog = this.state.progress.find((p) => p.user_id === userId && p.lesson_id === lessonId);
    if (prog) {
      prog.completed = completed;
      prog.progress_percent = progressPercent;
      prog.last_watched_at = now;
    } else {
      prog = {
        id: 'prog_' + crypto.randomUUID().slice(0, 10),
        user_id: userId,
        lesson_id: lessonId,
        completed,
        progress_percent: progressPercent,
        last_watched_at: now,
      };
      this.state.progress.push(prog);
    }
    this.saveState(this.state);
    return prog;
  }

  // --- Site Settings ---
  public getSettings(): SiteSettings {
    return this.state.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.state.settings = {
      ...this.state.settings,
      ...updates,
      razorpay_configured: Boolean(
        (updates.razorpay_key_id || this.state.settings.razorpay_key_id || process.env.RAZORPAY_KEY_ID) &&
        (process.env.RAZORPAY_KEY_SECRET)
      ),
    };
    this.saveState(this.state);
    return this.state.settings;
  }
}

export const db = new MemoryDatabase();
