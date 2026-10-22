import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Package,
  Layers,
  Users,
  Star,
  CreditCard,
  Share2,
  Settings,
  HelpCircle,
  UserCheck,
  LogOut,
  Search,
  Globe,
  Maximize2,
  Moon,
  Sun,
  Bell,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Download,
  Eye,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Lock,
  FileText,
  Key,
} from 'lucide-react';
import { Bundle, Course, Order, Product, Review, SiteSettings, UserProfile } from '../types/index.ts';
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

type AdminTab =
  | 'dashboard'
  | 'product'
  | 'inventory'
  | 'customers'
  | 'review'
  | 'payment'
  | 'integration'
  | 'settings'
  | 'help'
  | 'manage_users';

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  products,
  bundles,
  courses,
  settings,
  onRefreshData,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState<'$' | '₹'>('$');
  const [timeframe, setTimeframe] = useState<'Previous Year' | 'Last 30 Days' | 'This Year'>('Previous Year');
  const [activeTooltip, setActiveTooltip] = useState<number | null>(3); // Default Sep 10 highlighted as in screenshot
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [stats, setStats] = useState<any>({
    ecommerce_revenue: 245450,
    new_customers: 684,
    repeat_purchase_rate: 75.12,
    average_order_value: 2412.23,
    conversion_rate: 32.65,
    total_orders: 128,
  });

  const [orders, setOrders] = useState<any[]>([
    {
      id: 'ord_1',
      product_name: 'Water Bottle',
      product_category: 'Digital Access',
      product_image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&auto=format&fit=crop&q=80',
      customer_name: 'Peterson Jack',
      customer_email: 'peterson@example.com',
      order_id: '#8441573',
      date: '27 Jun 2025',
      status: 'Pending',
      amount: 45.0,
    },
    {
      id: 'ord_2',
      product_name: 'Iphone 15 Pro',
      product_category: 'Starter Kit',
      product_image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&auto=format&fit=crop&q=80',
      customer_name: 'Michel Datta',
      customer_email: 'michel@example.com',
      order_id: '#2457841',
      date: '26 Jun 2025',
      status: 'Canceled',
      amount: 89.0,
    },
    {
      id: 'ord_3',
      product_name: 'Headphone',
      product_category: 'Sound Guide',
      product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80',
      customer_name: 'Jasiya Rose',
      customer_email: 'jasiya@example.com',
      order_id: '#1024784',
      date: '20 Jun 2025',
      status: 'Shipped',
      amount: 79.0,
    },
    {
      id: 'ord_4',
      product_name: 'Digital Product Launch Kit',
      product_category: 'Toolkit · PDF',
      product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop&q=80',
      customer_name: 'David Miller',
      customer_email: 'david@example.com',
      order_id: '#5541992',
      date: '18 Jun 2025',
      status: 'Shipped',
      amount: 89.0,
    },
    {
      id: 'ord_5',
      product_name: 'The Idea-to-Action Workbook',
      product_category: 'Workbook · PDF',
      product_image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&auto=format&fit=crop&q=80',
      customer_name: 'Sophia Chen',
      customer_email: 'sophia@example.com',
      order_id: '#3312091',
      date: '15 Jun 2025',
      status: 'Shipped',
      amount: 69.0,
    },
  ]);

  const [topCustomers, setTopCustomers] = useState([
    {
      id: 'cust_1',
      name: 'Marks Hoverson',
      email: 'marks@example.com',
      orders_count: 25,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'cust_2',
      name: 'Marks Hoverson',
      email: 'hoverson@example.com',
      orders_count: 15,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'cust_3',
      name: 'Jhony Peters',
      email: 'jhony@example.com',
      orders_count: 23,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
  ]);

  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(settings);
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load live server orders & reviews when available
  useEffect(() => {
    async function loadLiveData() {
      try {
        const liveOrders = await api.adminGetOrders();
        if (liveOrders && liveOrders.length > 0) {
          const mapped = liveOrders.map((o: any, idx: number) => ({
            id: o.id || `ord_${idx}`,
            product_name: o.items?.[0]?.title || 'Digital Product License',
            product_category: 'Official Edition',
            product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop&q=80',
            customer_name: o.customer_name || 'Verified Customer',
            customer_email: o.customer_email || 'customer@smartbanao.com',
            order_id: o.order_number || `#${o.id.slice(-6)}`,
            date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '22 Oct 2026',
            status: o.status === 'paid' ? 'Shipped' : 'Pending',
            amount: o.total_amount || 79,
          }));
          setOrders((prev) => [...mapped, ...prev.slice(mapped.length)]);
        }
      } catch {}

      try {
        const liveReviews = await api.adminGetReviews();
        if (liveReviews) setReviewsList(liveReviews);
      } catch {}
    }
    loadLiveData();
  }, []);

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
      setShowProductModal(false);
      setEditingProduct(null);
      setStatusNotice({ type: 'success', message: 'Product updated successfully!' });
      onRefreshData();
    } catch (err: any) {
      setStatusNotice({ type: 'error', message: err.message || 'Error saving product' });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.adminDeleteProduct(id);
      setStatusNotice({ type: 'success', message: 'Product deleted from store catalog.' });
      onRefreshData();
    } catch (err: any) {
      setStatusNotice({ type: 'error', message: err.message || 'Error deleting product' });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.adminUpdateSettings(siteSettingsForm);
      setSiteSettingsForm(updated);
      setStatusNotice({ type: 'success', message: 'Store settings saved successfully!' });
      onRefreshData();
    } catch (err: any) {
      setStatusNotice({ type: 'error', message: 'Failed to update settings' });
    }
  };

  // Chart data points matching the screenshot
  const chartDays = [
    { label: 'Sep 07', order: 5500, income: 4200 },
    { label: 'Sep 08', order: 6300, income: 6800 },
    { label: 'Sep 09', order: 8200, income: 6100 },
    { label: 'Sep 10', order: 9800, income: 4300, valueBadge: '$4,300' },
    { label: 'Sep 11', order: 6900, income: 3800 },
    { label: 'Sep 12', order: 7400, income: 6200 },
    { label: 'Sep 13', order: 5800, income: 4100 },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#1E232A] flex font-sans antialiased">
      {/* 
        =============================================================================
        1. LEFT DARK SIDEBAR (Exact design from screenshot)
        =============================================================================
      */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 sm:w-64 bg-[#141518] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
          {/* Brand Logo Header */}
          <div className="p-5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              {/* Green Squircle Brand Badge matching screenshot */}
              <div className="w-8 h-8 rounded-xl bg-[#00E599] flex items-center justify-center text-[#141518] shadow-sm">
                <svg className="w-4 h-4 fill-current stroke-none" viewBox="0 0 24 24">
                  <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
                </svg>
              </div>
              <span className="font-bold text-lg tracking-tight text-white font-sans">
                subcom
              </span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6">
            {/* Section 1: GENREAL */}
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                GENREAL
              </p>

              {/* 1. Dashboard */}
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              {/* 2. Product */}
              <button
                onClick={() => {
                  setActiveTab('product');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'product'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Product</span>
              </button>

              {/* 3. Inventory */}
              <button
                onClick={() => {
                  setActiveTab('inventory');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Inventory</span>
              </button>

              {/* 4. Customers */}
              <button
                onClick={() => {
                  setActiveTab('customers');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'customers'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </button>

              {/* 5. Review (with green 02 pill badge) */}
              <button
                onClick={() => {
                  setActiveTab('review');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'review'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4" />
                  <span>Review</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#00E599]/20 text-[#00E599] text-[10px] font-bold">
                  02
                </span>
              </button>

              {/* 6. Payment */}
              <button
                onClick={() => {
                  setActiveTab('payment');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'payment'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Payment</span>
              </button>

              {/* 7. Integration */}
              <button
                onClick={() => {
                  setActiveTab('integration');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'integration'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Integration</span>
              </button>
            </div>

            {/* Section 2: ACCOUNT */}
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                ACCOUNT
              </p>

              {/* 8. Settings */}
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              {/* 9. Help */}
              <button
                onClick={() => {
                  setActiveTab('help');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'help'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </button>

              {/* 10. Manage Users */}
              <button
                onClick={() => {
                  setActiveTab('manage_users');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'manage_users'
                    ? 'bg-[#22252B] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Manage Users</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Logout Button */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-2xs animate-in fade-in"
        />
      )}

      {/* 
        =============================================================================
        2. RIGHT MAIN VIEW AREA
        =============================================================================
      */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Search input */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar matching screenshot */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F2F5F9] rounded-xl text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              />
            </div>
          </div>

          {/* Right: Icons & Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3.5 text-gray-500">
            {/* Currency toggle */}
            <button
              onClick={() => setCurrencySymbol(currencySymbol === '$' ? '₹' : '$')}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              title="Toggle Currency ($ / ₹)"
            >
              {currencySymbol}
            </button>

            {/* Language Icon */}
            <button className="p-2 hover:text-gray-900 rounded-lg transition-colors cursor-pointer hidden sm:block">
              <Globe className="w-4 h-4" />
            </button>

            {/* Maximize Icon */}
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="p-2 hover:text-gray-900 rounded-lg transition-colors cursor-pointer hidden sm:block"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <button className="p-2 hover:text-gray-900 rounded-lg transition-colors relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            </button>

            {/* User Profile Avatar with Online Dot */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] border-2 border-white absolute bottom-0 right-0" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-tight">
                  {user.full_name || 'Mahfuzul'}
                </p>
                <p className="text-[10px] text-gray-400 capitalize">Store Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Status notification toast */}
        {statusNotice && (
          <div className="p-3 mx-4 sm:mx-8 mt-4 rounded-xl flex items-center justify-between text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>{statusNotice.message}</span>
            <button onClick={() => setStatusNotice(null)} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 
          =============================================================================
          3. MAIN TAB CONTENT
          =============================================================================
        */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD (Identical to screenshot) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Greeting & Timeframe selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    Welcome Back, {user.full_name ? user.full_name.split(' ')[0] : 'Mahfuzul'}!
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Here's what happening with your store today
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value as any)}
                      className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 focus:outline-none cursor-pointer"
                    >
                      <option value="Previous Year">Previous Year</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="This Year">This Year</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <button className="px-4 py-2 bg-[#141518] hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer">
                    View All Time
                  </button>
                </div>
              </div>

              {/* 
                =========================================================================
                METRIC CARDS ROW (5 cards with exact pastel tints from screenshot)
                =========================================================================
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* 1. Ecommerce Revenue */}
                <div className="bg-[#FDF3EA] rounded-2xl p-4 sm:p-5 border border-[#FBEADF] shadow-2xs space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Ecommerce Revenue</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-900 font-mono tracking-tight">
                    {currencySymbol}245,450
                  </p>
                  <div className="flex items-center gap-2 text-[10px] pt-1">
                    <span className="flex items-center text-emerald-600 font-bold">
                      ▲ 14.9%
                    </span>
                    <span className="text-gray-400 font-medium">(+43.21%)</span>
                  </div>
                </div>

                {/* 2. New Customers */}
                <div className="bg-[#EEF7EF] rounded-2xl p-4 sm:p-5 border border-[#DEEEDE] shadow-2xs space-y-2">
                  <p className="text-xs font-semibold text-gray-600">New Customers</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-900 font-mono tracking-tight">
                    684
                  </p>
                  <div className="flex items-center gap-2 text-[10px] pt-1">
                    <span className="flex items-center text-rose-500 font-bold">
                      ▼ -8.6%
                    </span>
                  </div>
                </div>

                {/* 3. Repeat Purchase Rate */}
                <div className="bg-[#EEF5FF] rounded-2xl p-4 sm:p-5 border border-[#DEEBFC] shadow-2xs space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Repeat Purchase Rate</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-900 font-mono tracking-tight">
                    75.12 %
                  </p>
                  <div className="flex items-center gap-2 text-[10px] pt-1">
                    <span className="flex items-center text-emerald-600 font-bold">
                      ▲ 25.4%
                    </span>
                    <span className="text-gray-400 font-medium">(+20.11%)</span>
                  </div>
                </div>

                {/* 4. Average Order Value */}
                <div className="bg-[#EFF8F6] rounded-2xl p-4 sm:p-5 border border-[#DCF1EC] shadow-2xs space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Average Order Value</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-900 font-mono tracking-tight">
                    {currencySymbol}2,412.23
                  </p>
                  <div className="flex items-center gap-2 text-[10px] pt-1">
                    <span className="flex items-center text-emerald-600 font-bold">
                      ▲ 35.2%
                    </span>
                    <span className="text-gray-400 font-medium">(+ {currencySymbol}754)</span>
                  </div>
                </div>

                {/* 5. Conversion rate */}
                <div className="bg-[#FDF0F3] rounded-2xl p-4 sm:p-5 border border-[#FBE0E7] shadow-2xs space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Conversion rate</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-900 font-mono tracking-tight">
                    32.65 %
                  </p>
                  <div className="flex items-center gap-2 text-[10px] pt-1">
                    <span className="flex items-center text-rose-500 font-bold">
                      ▼ 12.42%
                    </span>
                  </div>
                </div>
              </div>

              {/* 
                =========================================================================
                MIDDLE ROW: Summary Chart (8 cols) + Most Selling Products (4 cols)
                =========================================================================
              */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Card: Summary Interactive Chart */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs space-y-4">
                  {/* Card Header with Legend and Period */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-base font-bold text-gray-900">Summary</h2>

                    <div className="flex items-center gap-4 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                        <span className="text-gray-600">Order</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                        <span className="text-gray-600">Income Growth</span>
                      </div>

                      <div className="relative pl-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">
                          <span>Last 7 days</span>
                          <ChevronDown className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SVG Multi-curve Line Chart */}
                  <div className="relative pt-4 pb-2">
                    <div className="h-64 sm:h-72 w-full flex">
                      {/* Y-Axis Labels */}
                      <div className="w-10 flex flex-col justify-between text-[11px] font-mono text-gray-400 pr-2 select-none">
                        <span>10K</span>
                        <span>7K</span>
                        <span>5K</span>
                        <span>3K</span>
                        <span>0K</span>
                      </div>

                      {/* Chart Drawing Area */}
                      <div className="relative flex-1">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
                          {/* Horizontal Grid lines */}
                          <line x1="0" y1="0" x2="700" y2="0" stroke="#F1F3F5" strokeDasharray="3 3" />
                          <line x1="0" y1="60" x2="700" y2="60" stroke="#F1F3F5" strokeDasharray="3 3" />
                          <line x1="0" y1="120" x2="700" y2="120" stroke="#F1F3F5" strokeDasharray="3 3" />
                          <line x1="0" y1="180" x2="700" y2="180" stroke="#F1F3F5" strokeDasharray="3 3" />
                          <line x1="0" y1="240" x2="700" y2="240" stroke="#F1F3F5" />

                          {/* Sep 10 Column Highlight */}
                          <rect
                            x="320"
                            y="40"
                            width="50"
                            height="200"
                            rx="12"
                            fill="#F0F5FF"
                            opacity="0.8"
                          />

                          {/* Line 1: Order (Vibrant Green) */}
                          <path
                            d="M 10 125 C 60 120, 100 80, 150 90 C 200 100, 240 60, 310 45 C 370 30, 420 130, 480 120 C 530 110, 580 160, 640 140 C 670 130, 690 125, 700 130"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />

                          {/* Line 2: Income Growth (Teal Wave) */}
                          <path
                            d="M 10 150 C 70 145, 110 110, 160 125 C 210 140, 270 120, 345 95 C 410 70, 460 170, 510 165 C 570 160, 610 135, 660 150 C 680 155, 695 160, 700 160"
                            fill="none"
                            stroke="#34D399"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />

                          {/* Blue pinpoint on Sep 10 (as shown in screenshot) */}
                          <circle cx="345" cy="95" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                        </svg>

                        {/* Floating Tooltip Pill for Sep 10 ($4,300) matching screenshot */}
                        <div
                          className="absolute left-[45%] top-[14%] -translate-x-1/2 -translate-y-full bg-white px-3 py-1.5 rounded-xl shadow-md border border-gray-100 flex items-center gap-1.5 z-10"
                        >
                          <span className="text-xs font-bold text-gray-900 font-mono">$4,300</span>
                        </div>
                      </div>
                    </div>

                    {/* X-Axis Day Labels */}
                    <div className="flex justify-between pl-12 pr-4 pt-2 text-[11px] font-semibold text-gray-400 select-none">
                      {chartDays.map((d, i) => (
                        <span
                          key={d.label}
                          className={i === 3 ? 'text-gray-900 font-bold underline decoration-blue-500 decoration-2 underline-offset-4' : ''}
                        >
                          {d.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Card: Most Selling Products */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Most Selling Products</h2>
                    <button className="text-gray-400 hover:text-gray-700 cursor-pointer">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#F0F5FA] flex items-center justify-center p-2 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80"
                            alt="Snicker Vento"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">Snicker Vento</p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: 2441310</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold shrink-0">
                        128 Sales
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#F0F5FA] flex items-center justify-center p-2 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&auto=format&fit=crop&q=80"
                            alt="Blue Backpack"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">Blue Backpack</p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: 1241318</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold shrink-0">
                        401 Sales
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#F0F5FA] flex items-center justify-center p-2 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&auto=format&fit=crop&q=80"
                            alt="Water Bottle"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">Water Bottle</p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: 8441573</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold shrink-0">
                        1K+ Sales
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 
                =========================================================================
                BOTTOM ROW: Recent Orders Table (8 cols) + Weekly Top Customers (4 cols)
                =========================================================================
              */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Card: Recent Orders Table */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
                    <button
                      onClick={() => setActiveTab('payment')}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  {/* Orders Table Container */}
                  <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-gray-400 font-semibold border-b border-gray-100 pb-2">
                          <th className="pb-3 font-semibold">Product</th>
                          <th className="pb-3 font-semibold">Customer</th>
                          <th className="pb-3 font-semibold">Order ID</th>
                          <th className="pb-3 font-semibold">Date</th>
                          <th className="pb-3 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 4).map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                            {/* Product column with small image thumbnail */}
                            <td className="py-3 flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                <img
                                  src={order.product_image}
                                  alt={order.product_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-semibold text-gray-900 truncate max-w-[130px]">
                                {order.product_name}
                              </span>
                            </td>

                            {/* Customer column with blue link style matching screenshot */}
                            <td className="py-3 font-medium text-blue-600 hover:underline cursor-pointer">
                              {order.customer_name}
                            </td>

                            {/* Order ID */}
                            <td className="py-3 text-gray-400 font-mono">{order.order_id}</td>

                            {/* Date */}
                            <td className="py-3 text-gray-500">{order.date}</td>

                            {/* Status Pill Badge */}
                            <td className="py-3 text-right">
                              {order.status === 'Pending' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200/50">
                                  ● Pending
                                </span>
                              )}
                              {order.status === 'Canceled' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-500 border border-rose-200/50">
                                  ● Canceled
                                </span>
                              )}
                              {order.status === 'Shipped' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                                  ● Shipped
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Card: Weekly Top Customers */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Weekly Top Customers</h2>
                    <button className="text-gray-400 hover:text-gray-700 cursor-pointer">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 pt-1">
                    {topCustomers.map((cust) => (
                      <div
                        key={cust.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cust.avatar}
                            alt={cust.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{cust.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">
                              {cust.orders_count} Orders
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('customers')}
                          className="px-3 py-1 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT PAGE */}
          {activeTab === 'product' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Products Catalog</h2>
                  <p className="text-xs text-gray-500">
                    Manage digital guides, workbooks, video workshops, and bundles.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct({
                      title: '',
                      slug: '',
                      description: '',
                      short_description: '',
                      price: 79,
                      original_price: 399,
                      product_type: 'pdf',
                      status: 'published',
                    });
                    setShowProductModal(true);
                  }}
                  className="px-4 py-2.5 bg-[#141518] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 font-semibold border-b border-gray-100">
                      <th className="pb-3">Title</th>
                      <th className="pb-3">Format</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Original</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80">
                        <td className="py-3 font-bold text-gray-900">{p.title}</td>
                        <td className="py-3 uppercase font-mono text-[10px] text-gray-500">
                          {p.product_type}
                        </td>
                        <td className="py-3 font-mono font-bold text-gray-900">₹{p.price}</td>
                        <td className="py-3 font-mono text-gray-400 line-through">₹{p.original_price}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                            Published
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setShowProductModal(true);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Digital Asset Inventory</h2>
                <p className="text-xs text-gray-500">
                  Manage digital deliverables, downloadable PDFs, licenses, and verified package streams.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <p className="text-xs text-gray-400">Total Digital Assets</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length} Products</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <p className="text-xs text-gray-400">Security Gate</p>
                  <p className="text-2xl font-bold text-emerald-600">Anti-Bypass RLS</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <p className="text-xs text-gray-400">Delivery Status</p>
                  <p className="text-2xl font-bold text-blue-600">Instant Sync 100%</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 font-semibold border-b border-gray-100">
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">File Specs</th>
                      <th className="pb-3">License Type</th>
                      <th className="pb-3">Access Security</th>
                      <th className="pb-3 text-right">Download Test</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80">
                        <td className="py-3 font-semibold text-gray-900">{p.title}</td>
                        <td className="py-3 text-gray-500 font-mono">{p.file_size || 'PDF Guide'}</td>
                        <td className="py-3 text-gray-600">Personal & Commercial</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              window.open(`/api/download/${p.id}`, '_blank');
                            }}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold cursor-pointer"
                          >
                            Test Stream
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Customer Accounts</h2>
                  <p className="text-xs text-gray-500">
                    Active learners, license holders, and verified account registrations.
                  </p>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-semibold text-gray-600">
                  Daily IP Limit: 5 Attempts Max (Active)
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 font-semibold border-b border-gray-100">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Orders</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-gray-50/80">
                        <td className="py-3 font-bold text-gray-900">{cust.name}</td>
                        <td className="py-3 text-gray-500 font-mono">{cust.email}</td>
                        <td className="py-3 font-semibold text-blue-600">{cust.orders_count} Orders</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                            Active Lifetime
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEW */}
          {activeTab === 'review' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Customer Feedback & Reviews</h2>
                <p className="text-xs text-gray-500">
                  Moderate submitted reviews, star ratings, and community feedback.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Rahul Sharma',
                    rating: 5,
                    date: 'Yesterday',
                    comment: 'The Launch Kit saved me weeks of unnecessary planning. Crisp and directly actionable.',
                  },
                  {
                    name: 'Ananya Verma',
                    rating: 5,
                    date: '3 days ago',
                    comment: 'Idea-to-Action Workbook has phenomenal clarity. Perfect for independent creators.',
                  },
                ].map((rev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-xs">{rev.name}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENT */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Payment Gateway Configuration</h2>
                <p className="text-xs text-gray-500">
                  Razorpay API integration, UPI instant routing, and cryptographic verification keys.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <Key className="w-4 h-4 text-emerald-600" />
                    <span>Razorpay Key ID</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="rzp_test_smartbanao_demo"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                    readOnly
                  />
                  <p className="text-[10px] text-gray-400">
                    Production sandbox with instantaneous bank verification active.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>HMAC-SHA256 Webhook Verification</span>
                  </div>
                  <input
                    type="password"
                    defaultValue="smartbanao_secret_hash_2026"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                    readOnly
                  />
                  <p className="text-[10px] text-gray-400">
                    Protects server endpoints from forged gateway notifications.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INTEGRATION */}
          {activeTab === 'integration' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Integrations & Ads Configuration</h2>
                <p className="text-xs text-gray-500">
                  Google AdSense, Google Analytics, Meta Pixel, and Search Grounding.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
                  <p className="text-xs font-bold text-gray-900">Google Adsense / Ads.txt</p>
                  <textarea
                    rows={3}
                    defaultValue="google.com, pub-6849204819402847, DIRECT, f08c47fec0942fa0"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Store Settings</h2>
                <p className="text-xs text-gray-500">General preferences, brand identity, and support channels.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    defaultValue="SmartBanao"
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@smartbanao.com"
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#141518] hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Store Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 9: HELP */}
          {activeTab === 'help' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Admin Documentation & Security Guide</h2>
                <p className="text-xs text-gray-500">Quick-start guidance for store management and security.</p>
              </div>

              <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-1">
                  <p className="font-bold text-gray-900">Anti-Bypass Protection</p>
                  <p>
                    All download routes `/api/download/:productId` require authenticated sessions and verified payment records. Unauthorized download requests are automatically blocked with 401 or 403.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-1">
                  <p className="font-bold text-gray-900">Daily IP Rate Limiting</p>
                  <p>
                    Brute-force and bot protections enforce a maximum of 5 sign-in or account creation attempts per IP address per 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: MANAGE USERS */}
          {activeTab === 'manage_users' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Administrative Access & Roles</h2>
                <p className="text-xs text-gray-500">Super admins and authorized store operators.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 font-semibold border-b border-gray-100">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Permissions</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/80">
                      <td className="py-3">
                        <p className="font-bold text-gray-900">{user.full_name || 'Admin User'}</p>
                        <p className="text-gray-400 font-mono text-[10px]">{user.email || 'admin@smartbanao.com'}</p>
                      </td>
                      <td className="py-3 font-semibold text-blue-600">Super Administrator</td>
                      <td className="py-3 text-gray-600">Full Store & Revenue Access</td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 
        =============================================================================
        EDIT / ADD PRODUCT MODAL
        =============================================================================
      */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                  placeholder="e.g. Digital Product Launch Kit"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (₹ / $)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Original Price</label>
                  <input
                    type="number"
                    value={editingProduct.original_price || 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, original_price: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Format Type</label>
                <select
                  value={editingProduct.product_type || 'pdf'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, product_type: e.target.value as any })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                >
                  <option value="pdf">PDF Guide / Checklist</option>
                  <option value="ebook">E-Book</option>
                  <option value="template">Worksheet / Template</option>
                  <option value="video_course">Video Workshop</option>
                  <option value="zip_pack">ZIP Resource Pack</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                  placeholder="Comprehensive description of the product..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#141518] hover:bg-black text-white font-bold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
