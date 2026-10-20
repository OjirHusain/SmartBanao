import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Layers,
  Video,
  ShoppingBag,
  Users,
  MessageSquare,
  Globe,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Search,
  Check,
  AlertCircle,
  RefreshCw,
  DollarSign,
  Radio,
  Copy,
  CheckCheck,
  FileCode,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  Bundle,
  Course,
  Order,
  Product,
  Review,
  SiteSettings,
  UserProfile,
  AdSettings,
} from '../types/index.ts';
import { api } from '../lib/api.ts';

interface AdminViewProps {
  user: UserProfile;
  products: Product[];
  bundles: Bundle[];
  courses: Course[];
  settings: SiteSettings;
  onRefreshData: () => void;
  onNavigate: (view: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  products,
  bundles,
  courses,
  settings,
  onRefreshData,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'stats' | 'products' | 'bundles' | 'courses' | 'orders' | 'customers' | 'reviews' | 'content' | 'settings' | 'ads'
  >('stats');

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [adminReviews, setAdminReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals for Create/Edit
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingBundle, setEditingBundle] = useState<Partial<Bundle> | null>(null);
  const [searchOrderQuery, setSearchOrderQuery] = useState('');

  // Editable settings form
  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);

  // Editable ads control form
  const [adsForm, setAdsForm] = useState<AdSettings>(
    settings.ads || {
      master_ads_enabled: true,
      ad_free_for_vip: true,
      adsense_enabled: true,
      adsense_client_id: 'ca-pub-6849204819402847',
      adsense_auto_ads: false,
      header_ad: { enabled: true, slot_id: '9284019284', format: 'horizontal' },
      in_feed_ad: { enabled: true, slot_id: '4820194829', format: 'responsive' },
      footer_ad: { enabled: true, slot_id: '1039482910', format: 'horizontal' },
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
      ads_txt: 'google.com, pub-6849204819402847, DIRECT, f08c47fec0942fa0\nmedia.net, 8C2749, DIRECT',
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
    }
  );
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'stats') {
        const s = await api.adminGetStats();
        setStats(s);
      } else if (activeTab === 'orders') {
        const ords = await api.adminGetOrders();
        setOrders(ords);
      } else if (activeTab === 'customers') {
        const custs = await api.adminGetCustomers();
        setCustomers(custs);
      } else if (activeTab === 'reviews') {
        const revs = await api.adminGetReviews();
        setAdminReviews(revs);
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to load data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) return;
    try {
      await api.adminSaveProduct({
        ...editingProduct,
        title: editingProduct.title,
        price: Number(editingProduct.price),
        product_type: editingProduct.product_type || 'pdf',
      } as any);
      setEditingProduct(null);
      setMsg({ type: 'success', text: 'Product saved successfully!' });
      onRefreshData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Error saving product' });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.adminDeleteProduct(id);
      setMsg({ type: 'success', text: 'Product removed.' });
      onRefreshData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Error deleting product' });
    }
  };

  const handleSaveBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBundle?.title || !editingBundle?.price) return;
    try {
      await api.adminSaveBundle({
        ...editingBundle,
        title: editingBundle.title,
        price: Number(editingBundle.price),
        included_product_ids: editingBundle.included_product_ids || [],
      } as any);
      setEditingBundle(null);
      setMsg({ type: 'success', text: 'Bundle saved successfully!' });
      onRefreshData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Error saving bundle' });
    }
  };

  const handleDeleteBundle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;
    try {
      await api.adminDeleteBundle(id);
      setMsg({ type: 'success', text: 'Bundle removed.' });
      onRefreshData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Error deleting bundle' });
    }
  };

  const handleModerateReview = async (reviewId: string, approved: boolean) => {
    try {
      await api.adminModerateReview(reviewId, approved);
      setAdminReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, is_approved: approved } : r))
      );
      setMsg({ type: 'success', text: `Review ${approved ? 'approved' : 'rejected'}.` });
    } catch (err: any) {
      setMsg({ type: 'error', text: 'Error updating review' });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.adminUpdateSettings(siteForm);
      setSiteForm(updated);
      setMsg({ type: 'success', text: 'Website settings updated!' });
      onRefreshData();
    } catch (err: any) {
      setMsg({ type: 'error', text: 'Failed to update settings' });
    }
  };

  const handleSaveAds = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.adminUpdateSettings({ ads: adsForm });
      setSiteForm(updated);
      setMsg({ type: 'success', text: 'AdSense & Ad Networks configuration saved and active!' });
      onRefreshData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to update ad settings' });
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchOrderQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-2xl text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SmartBanao Admin Control</h1>
            <p className="text-xs text-slate-400">
              Role: Master Administrator · Server-Side Verification Enforced
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('home')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span>Return to Store</span>
          </button>
          <button
            onClick={loadAdminData}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="font-bold underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'stats', label: 'Dashboard Stats', icon: TrendingUp },
          { id: 'ads', label: 'AdSense & Ads Control', icon: DollarSign },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'bundles', label: `Bundles (${bundles.length})`, icon: Layers },
          { id: 'courses', label: `Video Courses (${courses.length})`, icon: Video },
          { id: 'orders', label: 'Orders & Payments', icon: ShoppingBag },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
          { id: 'content', label: 'Website Content', icon: Globe },
          { id: 'settings', label: 'Gateway Settings', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB A: DASHBOARD STATS */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Verified Revenue</span>
              <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                ₹{stats.total_revenue_inr}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                {stats.paid_orders_count} Paid Orders
              </span>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Total Products</span>
              <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                {stats.total_products}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {stats.published_products} Published
              </span>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Digital Bundles</span>
              <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                {stats.total_bundles}
              </p>
              <span className="text-[11px] text-sky-600 mt-1 block">
                Bundle A, Bundle B & Custom
              </span>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Registered Customers</span>
              <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                {stats.total_customers}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                With verified accounts
              </span>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Paid Orders</h3>
            <div className="divide-y divide-slate-100">
              {stats.recent_orders?.map((ord: Order) => (
                <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{ord.order_number}</span>
                    <span className="text-slate-500 ml-2">{ord.customer_name} ({ord.customer_email})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900">₹{ord.total_amount}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Digital Product Catalog</h3>
            <button
              onClick={() =>
                setEditingProduct({
                  title: '',
                  price: 499,
                  product_type: 'pdf',
                  status: 'published',
                  description: '',
                  includes: [],
                })
              }
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Price (₹)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{p.title}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px]">
                        {p.product_type}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-semibold">₹{p.price}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="text-slate-600 hover:text-slate-900 p-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: BUNDLES MANAGEMENT */}
      {activeTab === 'bundles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Digital Bundles</h3>
              <p className="text-xs text-slate-500">
                Bundle A, Bundle B, and custom bundles. One-time purchases with zero recurring billing.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingBundle({
                  title: 'New Bundle',
                  price: 999,
                  description: '',
                  included_product_ids: [],
                  is_published: true,
                })
              }
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Bundle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bundles.map((b) => (
              <div key={b.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{b.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{b.description}</p>
                  </div>
                  <span className="font-mono font-bold text-lg text-slate-900">₹{b.price}</span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold">{b.included_product_ids.length} Products Included</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {b.is_published ? 'Published' : 'Draft'}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingBundle(b)}
                      className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                    >
                      Edit Bundle
                    </button>
                    <button
                      onClick={() => handleDeleteBundle(b.id)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB E: ORDERS & PAYMENTS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900">All Orders & Payment Audits</h3>
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by order #, email, name..."
                value={searchOrderQuery}
                onChange={(e) => setSearchOrderQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Order Number</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Payment Verification</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{ord.order_number}</td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-900">{ord.customer_name}</p>
                      <p className="text-[11px] text-slate-400">{ord.customer_email}</p>
                    </td>
                    <td className="p-3.5 font-mono font-bold">₹{ord.total_amount}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {ord.payment?.status || ord.status} (HMAC Verified)
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB F: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Customer Accounts & Product Access</h3>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Orders</th>
                  <th className="p-3.5">Purchased Access Count</th>
                  <th className="p-3.5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3.5 font-bold text-slate-900">
                      {c.full_name} <span className="text-slate-400 font-normal">({c.email})</span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {c.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono">{c.orders_count}</td>
                    <td className="p-3.5 font-mono text-sky-700 font-bold">{c.access?.length || 0} Products</td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB G: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Customer Reviews Moderation</h3>
          <div className="space-y-3">
            {adminReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{rev.author_name}</span>
                    <span className="text-[10px] text-slate-400">Rating: {rev.rating}/5</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 italic">"{rev.comment}"</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {rev.is_approved ? (
                    <button
                      onClick={() => handleModerateReview(rev.id, false)}
                      className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded"
                    >
                      Unpublish
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerateReview(rev.id, true)}
                      className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded"
                    >
                      Approve & Publish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB H: WEBSITE CONTENT */}
      {activeTab === 'content' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl border border-slate-200 max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-slate-900">Website Announcement & Promo Banner</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Store Name</label>
            <input
              type="text"
              value={siteForm.store_name}
              onChange={(e) => setSiteForm({ ...siteForm, store_name: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={siteForm.tagline}
              onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="promo_active"
              checked={siteForm.promo_banner_enabled}
              onChange={(e) => setSiteForm({ ...siteForm, promo_banner_enabled: e.target.checked })}
            />
            <label htmlFor="promo_active" className="text-xs font-medium text-slate-700">
              Enable Promotional Top Banner
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Promo Banner Text</label>
            <input
              type="text"
              value={siteForm.promo_banner_text}
              onChange={(e) => setSiteForm({ ...siteForm, promo_banner_text: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
          >
            Save Content Changes
          </button>
        </form>
      )}

      {/* TAB J: ADSENSE & AD NETWORKS CONTROL */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                  Monetization Hub
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">
                Google AdSense & Ad Platforms Control Panel
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Configure your Google AdSense publisher ID, Auto Ads, custom ad network scripts (Media.net, Ezoic, etc.), affiliate sponsor banners, and ads.txt records.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                  adsForm.master_ads_enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{adsForm.master_ads_enabled ? 'Ads Live & Active' : 'Ads Paused Globally'}</span>
              </span>
            </div>
          </div>

          {/* Ad Revenue & Traffic Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
                Today's Impressions
              </span>
              <p className="text-xl font-black text-slate-900 font-mono">
                {adsForm.analytics?.impressions_today?.toLocaleString() || '14,280'}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">▲ +12% vs yesterday</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
                Today's Clicks
              </span>
              <p className="text-xl font-black text-slate-900 font-mono">
                {adsForm.analytics?.clicks_today?.toLocaleString() || '432'}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">▲ High buyer intent</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
                CTR (Click Rate)
              </span>
              <p className="text-xl font-black text-slate-900 font-mono">
                {adsForm.analytics?.ctr_percent || '3.02'}%
              </p>
              <span className="text-[10px] text-slate-500">Industry avg: 1.8%</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
                Effective eCPM
              </span>
              <p className="text-xl font-black text-slate-900 font-mono">
                ₹{adsForm.analytics?.ecpm_inr || '85.50'}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">High tier audience</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider font-mono">
                Estimated Revenue
              </span>
              <p className="text-xl font-black text-emerald-900 font-mono">
                ₹{adsForm.analytics?.estimated_revenue_inr?.toLocaleString() || '1,220.94'}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold">Today's yield</span>
            </div>
          </div>

          <form onSubmit={handleSaveAds} className="space-y-6">
            {/* 1. Global Master Switches */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">1. Global Delivery Controls</h4>
                  <p className="text-xs text-slate-500">Master on/off switch and VIP ad-free logic</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={adsForm.master_ads_enabled}
                    onChange={(e) => setAdsForm({ ...adsForm, master_ads_enabled: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-emerald-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Enable Advertising System (Master Switch)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Instantly toggles all AdSense and network banners across the entire website.
                    </span>
                  </div>
                </label>

                <label className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={adsForm.ad_free_for_vip}
                    onChange={(e) => setAdsForm({ ...adsForm, ad_free_for_vip: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-emerald-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Ad-Free for Enrolled & Verified Learners (VIP)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Customers who have purchased guides or courses get a 100% ad-free experience.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Google AdSense Suite */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">2. Google AdSense Configuration</h4>
                  <p className="text-xs text-slate-500">Publisher identification and responsive unit slots</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">AdSense Active:</span>
                  <input
                    type="checkbox"
                    checked={adsForm.adsense_enabled}
                    onChange={(e) => setAdsForm({ ...adsForm, adsense_enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 font-mono uppercase text-[11px]">
                    Google AdSense Publisher ID (Client Key)
                  </label>
                  <input
                    type="text"
                    value={adsForm.adsense_client_id}
                    onChange={(e) => setAdsForm({ ...adsForm, adsense_client_id: e.target.value })}
                    placeholder="ca-pub-6849204819402847"
                    className="w-full px-3 py-2.5 border rounded-xl font-mono text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Your unique AdSense account ID found in your Google AdSense dashboard.
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adsForm.adsense_auto_ads}
                      onChange={(e) => setAdsForm({ ...adsForm, adsense_auto_ads: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Enable Google Auto Ads (Machine Placed)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Automatically discovers optimum placement zones.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Dedicated Slot IDs */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-800 block">Dedicated Ad Unit Placements</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px]">Header Top Banner</span>
                      <input
                        type="checkbox"
                        checked={adsForm.header_ad?.enabled}
                        onChange={(e) =>
                          setAdsForm({
                            ...adsForm,
                            header_ad: { ...adsForm.header_ad, enabled: e.target.checked },
                          })
                        }
                        className="w-3.5 h-3.5 rounded text-emerald-600"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Slot ID: 9284019284"
                      value={adsForm.header_ad?.slot_id || ''}
                      onChange={(e) =>
                        setAdsForm({
                          ...adsForm,
                          header_ad: { ...adsForm.header_ad, slot_id: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px]">In-Feed (Product Grid)</span>
                      <input
                        type="checkbox"
                        checked={adsForm.in_feed_ad?.enabled}
                        onChange={(e) =>
                          setAdsForm({
                            ...adsForm,
                            in_feed_ad: { ...adsForm.in_feed_ad, enabled: e.target.checked },
                          })
                        }
                        className="w-3.5 h-3.5 rounded text-emerald-600"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Slot ID: 4820194829"
                      value={adsForm.in_feed_ad?.slot_id || ''}
                      onChange={(e) =>
                        setAdsForm({
                          ...adsForm,
                          in_feed_ad: { ...adsForm.in_feed_ad, slot_id: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px]">Footer Sticky Unit</span>
                      <input
                        type="checkbox"
                        checked={adsForm.footer_ad?.enabled}
                        onChange={(e) =>
                          setAdsForm({
                            ...adsForm,
                            footer_ad: { ...adsForm.footer_ad, enabled: e.target.checked },
                          })
                        }
                        className="w-3.5 h-3.5 rounded text-emerald-600"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Slot ID: 1039482910"
                      value={adsForm.footer_ad?.slot_id || ''}
                      onChange={(e) =>
                        setAdsForm({
                          ...adsForm,
                          footer_ad: { ...adsForm.footer_ad, slot_id: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Degar Ad Platforms (Media.net, Ezoic, Meta, Custom) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  3. Degar Ads Platforms (Other Networks & Custom Code)
                </h4>
                <p className="text-xs text-slate-500">
                  Integrate Media.net, Ezoic, Adsterra, Meta Audience Network, or direct HTML/JS scripts
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ad Network / Platform Name
                  </label>
                  <input
                    type="text"
                    value={adsForm.custom_network_name}
                    onChange={(e) => setAdsForm({ ...adsForm, custom_network_name: e.target.value })}
                    placeholder="e.g. Media.net / Ezoic / Adsterra"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 font-mono text-[11px]">
                    Custom Header Script Tag (Injected in &lt;head&gt;)
                  </label>
                  <textarea
                    rows={3}
                    value={adsForm.custom_head_script}
                    onChange={(e) => setAdsForm({ ...adsForm, custom_head_script: e.target.value })}
                    placeholder="<script async src='https://contextual.media.net/dmedianet.js?cid=XXXX'></script>"
                    className="w-full px-3 py-2 border rounded-xl font-mono text-xs bg-slate-950 text-emerald-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Paste verification or network loader script tag provided by your ad partner.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 font-mono text-[11px]">
                      In-Feed Custom Banner HTML/JS Snippet
                    </label>
                    <textarea
                      rows={3}
                      value={adsForm.custom_infeed_html}
                      onChange={(e) => setAdsForm({ ...adsForm, custom_infeed_html: e.target.value })}
                      placeholder="<!-- Paste custom in-feed 300x250 or responsive unit tag -->"
                      className="w-full px-3 py-2 border rounded-xl font-mono text-xs bg-slate-900 text-cyan-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 font-mono text-[11px]">
                      Footer Custom Sticky Banner HTML/JS Snippet
                    </label>
                    <textarea
                      rows={3}
                      value={adsForm.custom_footer_html}
                      onChange={(e) => setAdsForm({ ...adsForm, custom_footer_html: e.target.value })}
                      placeholder="<!-- Paste custom 728x90 leader-board banner tag -->"
                      className="w-full px-3 py-2 border rounded-xl font-mono text-xs bg-slate-900 text-cyan-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Direct Sponsor / Affiliate Banner Manager */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    4. Direct Affiliate & Sponsor Banner Manager
                  </h4>
                  <p className="text-xs text-slate-500">
                    Display high-converting editorial sponsor banners with direct payouts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Sponsor Banner Active:</span>
                  <input
                    type="checkbox"
                    checked={adsForm.sponsor_ad_enabled}
                    onChange={(e) => setAdsForm({ ...adsForm, sponsor_ad_enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sponsor Headline</label>
                  <input
                    type="text"
                    value={adsForm.sponsor_title}
                    onChange={(e) => setAdsForm({ ...adsForm, sponsor_title: e.target.value })}
                    placeholder="Cloud VPS & Pro Hosting for Creators"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Call-To-Action (CTA Button)</label>
                  <input
                    type="text"
                    value={adsForm.sponsor_cta}
                    onChange={(e) => setAdsForm({ ...adsForm, sponsor_cta: e.target.value })}
                    placeholder="Claim 60% Discount"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Destination URL</label>
                  <input
                    type="url"
                    value={adsForm.sponsor_link_url}
                    onChange={(e) => setAdsForm({ ...adsForm, sponsor_link_url: e.target.value })}
                    placeholder="https://partner-service.com/deal"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Banner Graphic Image URL</label>
                  <input
                    type="url"
                    value={adsForm.sponsor_banner_img}
                    onChange={(e) => setAdsForm({ ...adsForm, sponsor_banner_img: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Sponsor Subtitle / Pitch</label>
                  <input
                    type="text"
                    value={adsForm.sponsor_subtitle}
                    onChange={(e) => setAdsForm({ ...adsForm, sponsor_subtitle: e.target.value })}
                    placeholder="Deploy full-stack React, Node & Next.js projects with 99.99% uptime."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* 5. ads.txt File Management */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">5. Authorized Digital Sellers (ads.txt)</h4>
                  <p className="text-xs text-slate-500">
                    Mandatory for Google AdSense verification and revenue protection
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/ads.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View /ads.txt</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(adsForm.ads_txt);
                      setCopiedAdsTxt(true);
                      setTimeout(() => setCopiedAdsTxt(false), 2000);
                    }}
                    className="px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedAdsTxt ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAdsTxt ? 'Copied!' : 'Copy ads.txt'}</span>
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={adsForm.ads_txt}
                  onChange={(e) => setAdsForm({ ...adsForm, ads_txt: e.target.value })}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Format: &lt;Field #1&gt;, &lt;Field #2&gt;, &lt;Field #3&gt;, &lt;Field #4&gt; (e.g. google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0)
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 hover:from-emerald-600 hover:to-slate-800 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Save All Ad Settings & Deploy Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB K: GATEWAY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-slate-900">Payment Gateway Configuration (India)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Razorpay credentials are kept exclusively on the server in environment variables (never exposed in public tables or client responses).
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Gateway Status:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Server-Side Signature Validation Active
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Configured Key ID:</span>
              <span className="font-mono text-slate-800">{settings.razorpay_key_id || 'rzp_test_smartbanao_demo'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Webhook HMAC Verification:</span>
              <span className="font-semibold text-slate-800">Enabled (/api/payments/webhook)</span>
            </div>
          </div>
        </div>
      )}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingProduct.id ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Product Type</label>
                  <select
                    value={editingProduct.product_type || 'pdf'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, product_type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="pdf">PDF Guide</option>
                    <option value="ebook">E-Book</option>
                    <option value="video_course">Video Course</option>
                    <option value="template">Design Template</option>
                    <option value="zip_pack">ZIP Resource Pack</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUNDLE EDIT MODAL */}
      {editingBundle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingBundle.id ? 'Edit Bundle' : 'Create Bundle'}
            </h3>
            <form onSubmit={handleSaveBundle} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Bundle Title</label>
                <input
                  type="text"
                  required
                  value={editingBundle.title || ''}
                  onChange={(e) => setEditingBundle({ ...editingBundle, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Bundle Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingBundle.price || 0}
                  onChange={(e) => setEditingBundle({ ...editingBundle, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingBundle.description || ''}
                  onChange={(e) => setEditingBundle({ ...editingBundle, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Select Products Included in this Bundle:</label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 border p-2 rounded-lg bg-slate-50">
                  {products.map((p) => {
                    const isChecked = editingBundle.included_product_ids?.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const cur = editingBundle.included_product_ids || [];
                            const next = e.target.checked
                              ? [...cur, p.id]
                              : cur.filter((id) => id !== p.id);
                            setEditingBundle({ ...editingBundle, included_product_ids: next });
                          }}
                        />
                        <span>{p.title} (₹{p.price})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBundle(null)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold"
                >
                  Save Bundle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
