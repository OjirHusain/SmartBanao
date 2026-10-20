import {
  AuthResponse,
  Bundle,
  Course,
  LessonProgress,
  Order,
  Product,
  Review,
  SiteSettings,
  UserProfile,
} from '../types/index.ts';

const TOKEN_KEY = 'smartbanao_auth_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.message || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Settings
  async getSettings(): Promise<SiteSettings> {
    return fetchWithAuth<SiteSettings>('/api/settings');
  },

  // Auth
  async register(data: { email: string; password: string; full_name: string; phone?: string }): Promise<AuthResponse> {
    const res = await fetchWithAuth<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    authStorage.setToken(res.token);
    return res;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetchWithAuth<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    authStorage.setToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: UserProfile }> {
    return fetchWithAuth<{ user: UserProfile }>('/api/auth/me');
  },

  logout(): void {
    authStorage.removeToken();
  },

  async resetPassword(email: string, new_password: string): Promise<{ message: string }> {
    return fetchWithAuth<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, new_password }),
    });
  },

  // Products & Bundles
  async getProducts(): Promise<Product[]> {
    return fetchWithAuth<Product[]>('/api/products');
  },

  async getProduct(slug: string): Promise<{ product: Product; related: Product[] }> {
    return fetchWithAuth<{ product: Product; related: Product[] }>(`/api/products/${slug}`);
  },

  async getBundles(): Promise<(Bundle & { included_products: Product[]; regular_sum: number })[]> {
    return fetchWithAuth<(Bundle & { included_products: Product[]; regular_sum: number })[]>('/api/bundles');
  },

  async getBundle(slug: string): Promise<{ bundle: Bundle & { included_products: Product[]; regular_sum: number } }> {
    return fetchWithAuth<{ bundle: Bundle & { included_products: Product[]; regular_sum: number } }>(`/api/bundles/${slug}`);
  },

  // Courses
  async getCourse(id: string): Promise<{ course: Course; has_full_access: boolean }> {
    return fetchWithAuth<{ course: Course; has_full_access: boolean }>(`/api/courses/${id}`);
  },

  async saveCourseProgress(courseId: string, lessonId: string, completed: boolean, progressPercent: number): Promise<LessonProgress> {
    return fetchWithAuth<LessonProgress>(`/api/courses/${courseId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId, completed, progress_percent: progressPercent }),
    });
  },

  // Orders & Payment
  async createOrder(items: { itemType: 'product' | 'bundle'; itemId: string }[], phone?: string): Promise<{ order: Order; total_amount: number }> {
    return fetchWithAuth<{ order: Order; total_amount: number }>('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify({ items, customer_phone: phone }),
    });
  },

  async createRazorpayOrder(orderId: string): Promise<{
    gateway_order_id: string;
    order_id: string;
    order_number: string;
    amount_inr: number;
    amount_paise: number;
    currency: string;
    key_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    is_sandbox: boolean;
    sandbox_instructions?: string;
  }> {
    return fetchWithAuth('/api/payments/razorpay/create-order', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    });
  },

  async verifyRazorpayPayment(payload: {
    order_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature?: string;
    gateway?: 'razorpay' | 'upi' | 'test_sandbox';
  }): Promise<{ success: boolean; order: Order; message: string; granted_product_ids: string[] }> {
    return fetchWithAuth('/api/payments/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Library
  async getLibrary(): Promise<{
    products: Product[];
    courses: Course[];
    progress: LessonProgress[];
    orders: Order[];
  }> {
    return fetchWithAuth('/api/library');
  },

  async downloadProduct(productId: string): Promise<Blob> {
    const token = authStorage.getToken();
    const response = await fetch(`/api/download/${productId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      let errText = 'Failed to download file';
      try {
        const data = await response.json();
        errText = data.error || errText;
      } catch {}
      throw new Error(errText);
    }

    return response.blob();
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    return fetchWithAuth<Review[]>('/api/reviews');
  },

  async submitReview(data: { product_id?: string; bundle_id?: string; rating: number; comment: string }): Promise<{ message: string; review: Review }> {
    return fetchWithAuth<{ message: string; review: Review }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Contact
  async sendContact(data: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; message: string }> {
    return fetchWithAuth('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin APIs
  async adminGetStats(): Promise<{
    total_orders: number;
    paid_orders_count: number;
    total_revenue_inr: number;
    total_products: number;
    published_products: number;
    total_bundles: number;
    total_customers: number;
    recent_orders: Order[];
  }> {
    return fetchWithAuth('/api/admin/stats');
  },

  async adminSaveProduct(product: Partial<Product> & { title: string; price: number; product_type: Product['product_type'] }): Promise<Product> {
    return fetchWithAuth<Product>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async adminDeleteProduct(id: string): Promise<{ success: boolean }> {
    return fetchWithAuth<{ success: boolean }>(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  async adminSaveBundle(bundle: Partial<Bundle> & { title: string; price: number; included_product_ids: string[] }): Promise<Bundle> {
    return fetchWithAuth<Bundle>('/api/admin/bundles', {
      method: 'POST',
      body: JSON.stringify(bundle),
    });
  },

  async adminDeleteBundle(id: string): Promise<{ success: boolean }> {
    return fetchWithAuth<{ success: boolean }>(`/api/admin/bundles/${id}`, {
      method: 'DELETE',
    });
  },

  async adminSaveCourse(course: Course): Promise<Course> {
    return fetchWithAuth<Course>('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  },

  async adminGetOrders(): Promise<Order[]> {
    return fetchWithAuth<Order[]>('/api/admin/orders');
  },

  async adminGetCustomers(): Promise<(UserProfile & { access: string[]; orders_count: number })[]> {
    return fetchWithAuth<(UserProfile & { access: string[]; orders_count: number })[]>('/api/admin/customers');
  },

  async adminGetReviews(): Promise<Review[]> {
    return fetchWithAuth<Review[]>('/api/admin/reviews');
  },

  async adminModerateReview(id: string, is_approved: boolean): Promise<{ success: boolean }> {
    return fetchWithAuth<{ success: boolean }>(`/api/admin/reviews/${id}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ is_approved }),
    });
  },

  async adminUpdateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return fetchWithAuth<SiteSettings>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};
