import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { PromoBanner } from './components/PromoBanner.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CoursePlayer } from './components/CoursePlayer.tsx';
import { AdBanner } from './components/AdBanner.tsx';

import { HomeView } from './views/HomeView.tsx';
import { ProductsView } from './views/ProductsView.tsx';
import { ProductDetailView } from './views/ProductDetailView.tsx';
import { BundlesView } from './views/BundlesView.tsx';
import { BundleDetailView } from './views/BundleDetailView.tsx';
import { LibraryView } from './views/LibraryView.tsx';
import { LegalViews } from './views/LegalViews.tsx';
import { SecretAdminPortal } from './views/SecretAdminPortal.tsx';

import { api, authStorage } from './lib/api.ts';
import { Bundle, Course, Order, Product, Review, SiteSettings, UserProfile } from './types/index.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<(Bundle & { included_products: Product[]; regular_sum: number })[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // User Library Data
  const [ownedProducts, setOwnedProducts] = useState<Product[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [courseProgress, setCourseProgress] = useState<any[]>([]);

  // Selection states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<(Bundle & { included_products: Product[]; regular_sum: number }) | null>(null);
  const [activeCourse, setActiveCourse] = useState<{ course: Course; hasAccess: boolean } | null>(null);

  // Modals
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' }>({
    open: false,
    mode: 'login',
  });
  const [checkoutModal, setCheckoutModal] = useState<{
    open: boolean;
    item: Product | Bundle | null;
    itemType: 'product' | 'bundle';
  }>({
    open: false,
    item: null,
    itemType: 'product',
  });

  const [loadingInitial, setLoadingInitial] = useState(true);

  // Secret Admin URL route listener: checks /admin, /admin.php, #admin, ?admin, etc.
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        path.includes('/admin') ||
        path.includes('admin.php') ||
        hash.includes('admin') ||
        search.includes('admin')
      ) {
        setCurrentView('admin-portal');
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    // Global hidden shortcut: typing "admin" anywhere on keyboard opens the portal
    let keyBuffer = '';
    const handleGlobalKey = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-5);
      if (keyBuffer === 'admin') {
        setCurrentView('admin-portal');
        try {
          window.history.pushState(null, '', '/admin');
        } catch {}
      }
    };
    window.addEventListener('keydown', handleGlobalKey);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('keydown', handleGlobalKey);
    };
  }, []);

  // Initial Data Fetching
  useEffect(() => {
    async function init() {
      try {
        const [settingsData, productsData, bundlesData, reviewsData] = await Promise.all([
          api.getSettings(),
          api.getProducts(),
          api.getBundles(),
          api.getReviews(),
        ]);

        setSettings(settingsData);
        setProducts(productsData);
        setBundles(bundlesData);
        setReviews(reviewsData);

        // Check active session
        if (authStorage.getToken()) {
          try {
            const meRes = await api.getMe();
            setUser(meRes.user);
            await loadLibraryData();
          } catch {
            authStorage.removeToken();
          }
        }
      } catch (err) {
        console.error('Initialization error', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    init();
  }, []);

  const loadLibraryData = async () => {
    try {
      const lib = await api.getLibrary();
      setOwnedProducts(lib.products);
      setEnrolledCourses(lib.courses);
      setCourses(lib.courses);
      setUserOrders(lib.orders);
      setCourseProgress(lib.progress);
    } catch (err) {
      console.error('Failed to load library data', err);
    }
  };

  const handleRefreshData = async () => {
    try {
      const [productsData, bundlesData, settingsData] = await Promise.all([
        api.getProducts(),
        api.getBundles(),
        api.getSettings(),
      ]);
      setProducts(productsData);
      setBundles(bundlesData);
      setSettings(settingsData);
      if (user) {
        await loadLibraryData();
      }
    } catch (err) {
      console.error('Refresh error', err);
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    // If navigating to home, clean admin hash/route
    if (view === 'home') {
      if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
        window.history.pushState({}, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBundle = (bundle: Bundle) => {
    const full = bundles.find((b) => b.id === bundle.id) || (bundle as any);
    setSelectedBundle(full);
    setCurrentView('bundle-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyProduct = (product: Product) => {
    if (userOwnedProductIds.includes(product.id) && product.product_type === 'video_course') {
      handleOpenCourse(product.id);
      return;
    }
    if (userOwnedProductIds.includes(product.id)) {
      api.downloadProduct(product.id).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${product.slug}-SmartBanao.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
      return;
    }

    setCheckoutModal({
      open: true,
      item: product,
      itemType: 'product',
    });
  };

  const handleBuyBundle = (bundle: Bundle) => {
    setCheckoutModal({
      open: true,
      item: bundle,
      itemType: 'bundle',
    });
  };

  const handleOpenCourse = async (courseOrProductId: string) => {
    try {
      const courseRes = await api.getCourse(courseOrProductId);
      setActiveCourse({
        course: courseRes.course,
        hasAccess: courseRes.has_full_access,
      });
      setCurrentView('course-player');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to open course', err);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setOwnedProducts([]);
    setEnrolledCourses([]);
    setUserOrders([]);
    if (currentView === 'library' || currentView === 'admin-portal') {
      setCurrentView('home');
      window.history.pushState({}, '', '/');
    }
  };

  const handleCheckoutSuccess = async (order: Order) => {
    await loadLibraryData();
    await handleRefreshData();
  };

  const userOwnedProductIds = ownedProducts.map((p) => p.id);

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center text-[#16221c]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1b3428] text-white flex items-center justify-center font-bold text-sm tracking-tighter">
            s.
          </div>
          <span className="text-xs font-semibold tracking-wider text-[#54685c]">
            smartbanao...
          </span>
        </div>
      </div>
    );
  }

  // 1. SECRET ADMIN GATEWAY: Triggered only via /admin, /admin.php, #admin
  if (currentView === 'admin-portal') {
    return (
      <SecretAdminPortal
        user={user}
        products={products}
        bundles={bundles}
        courses={courses}
        settings={settings || ({} as any)}
        onRefreshData={handleRefreshData}
        onNavigateHome={() => handleNavigate('home')}
        onLoginSuccess={(adminUser) => {
          setUser(adminUser);
          loadLibraryData();
        }}
      />
    );
  }

  // 2. Full-screen Course Player view
  if (currentView === 'course-player' && activeCourse) {
    return (
      <CoursePlayer
        course={activeCourse.course}
        hasAccess={activeCourse.hasAccess}
        user={user}
        onBack={() => handleNavigate('home')}
        onBuyCourse={() => {
          const matchingProduct = products.find((p) => p.id === activeCourse.course.product_id);
          if (matchingProduct) {
            handleBuyProduct(matchingProduct);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#16221c]">
      {/* Promotional Top Banner (Exactly matching screenshot) */}
      <PromoBanner
        text={settings?.promo_banner_text}
        onExploreBundles={() => handleNavigate('bundles')}
      />

      {/* Header: Exact copy of screenshot, NO admin links shown */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode: mode || 'login' })}
        onLogout={handleLogout}
        onOpenSearch={() => handleNavigate('products')}
      />

      {/* Responsive Header Ad Banner (Managed via Admin Panel Ads Control) */}
      <AdBanner
        position="header"
        adsSettings={settings?.ads}
        isVipUser={Boolean(user && userOwnedProductIds.length > 0)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            bundles={bundles}
            reviews={reviews}
            onSelectProduct={handleSelectProduct}
            onBuyProduct={handleBuyProduct}
            onSelectBundle={handleSelectBundle}
            onBuyBundle={handleBuyBundle}
            onNavigate={handleNavigate}
            userOwnedProductIds={userOwnedProductIds}
            adsSettings={settings?.ads}
            isVipUser={Boolean(user && userOwnedProductIds.length > 0)}
          />
        )}

        {currentView === 'products' && (
          <ProductsView
            products={products}
            onSelectProduct={handleSelectProduct}
            onBuyProduct={handleBuyProduct}
            userOwnedProductIds={userOwnedProductIds}
          />
        )}

        {currentView === 'bundles' && (
          <BundlesView
            bundles={bundles}
            onSelectBundle={handleSelectBundle}
            onBuyBundle={handleBuyBundle}
            userOwnedProductIds={userOwnedProductIds}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            relatedProducts={products.filter((p) => p.id !== selectedProduct.id).slice(0, 3)}
            onBack={() => handleNavigate('products')}
            onBuyNow={handleBuyProduct}
            onSelectProduct={handleSelectProduct}
            onOpenCourse={handleOpenCourse}
            isOwned={userOwnedProductIds.includes(selectedProduct.id)}
          />
        )}

        {currentView === 'bundle-detail' && selectedBundle && (
          <BundleDetailView
            bundle={selectedBundle}
            onBack={() => handleNavigate('bundles')}
            onBuyNow={handleBuyBundle}
            onSelectProduct={handleSelectProduct}
            isAllOwned={
              selectedBundle.included_product_ids?.every((pid) =>
                userOwnedProductIds.includes(pid)
              ) || false
            }
          />
        )}

        {currentView === 'library' && (
          <LibraryView
            user={
              user || {
                id: 'guest',
                full_name: 'SmartBanao Learner',
                email: 'learner@smartbanao.com',
                role: 'customer',
                created_at: new Date().toISOString(),
              }
            }
            products={ownedProducts}
            courses={enrolledCourses.length > 0 ? enrolledCourses : courses}
            progress={courseProgress}
            orders={userOrders}
            onOpenCourse={handleOpenCourse}
            onExploreCatalog={() => handleNavigate('products')}
          />
        )}

        {['privacy', 'terms', 'refund', 'disclaimer', 'about', 'contact'].includes(currentView) && (
          <LegalViews
            page={currentView as any}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Responsive Footer Sticky / Banner Ad (Admin Managed) */}
      <AdBanner
        position="footer"
        adsSettings={settings?.ads}
        isVipUser={Boolean(user && userOwnedProductIds.length > 0)}
      />

      {/* Minimal Footer matching screenshot (No Admin link shown) */}
      <Footer onNavigate={handleNavigate} />

      {/* Checkout Modal */}
      {checkoutModal.open && checkoutModal.item && (
        <CheckoutModal
          item={checkoutModal.item}
          itemType={checkoutModal.itemType}
          user={user}
          onClose={() => setCheckoutModal({ open: false, item: null, itemType: 'product' })}
          onSuccess={handleCheckoutSuccess}
          onRequireAuth={() => setAuthModal({ open: true, mode: 'login' })}
        />
      )}

      {/* Authentication Modal */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            loadLibraryData();
          }}
        />
      )}
    </div>
  );
}
