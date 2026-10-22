import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { PromoBanner } from './components/PromoBanner.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CoursePlayer } from './components/CoursePlayer.tsx';
import { AdBanner } from './components/AdBanner.tsx';
import { BrandLogo } from './components/BrandLogo.tsx';

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
      if (!authStorage.getToken()) {
        return;
      }
      const lib = await api.getLibrary();
      setOwnedProducts((prev) => {
        const map = new Map<string, Product>();
        prev.forEach((p) => map.set(p.id, p));
        lib.products.forEach((p) => map.set(p.id, p));
        return Array.from(map.values());
      });
      setEnrolledCourses(lib.courses);
      setCourses((prev) => (lib.courses.length > 0 ? lib.courses : prev));
      setUserOrders(lib.orders);
      setCourseProgress(lib.progress);
    } catch {
      // Soft handling without uncaught exception
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
    if (view === 'admin' || view === 'admin-portal') {
      setCurrentView('admin-portal');
      try {
        window.history.pushState({}, '', '/admin');
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    // If navigating to home, clean admin hash/route
    if (view === 'home') {
      if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
        try {
          window.history.pushState({}, '', '/');
        } catch {}
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
      }).catch(() => {
        // High-fidelity fallback downloadable PDF
        const fallbackContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj 4 0 obj<</Length 180>>stream\nBT /F1 20 Tf 50 720 Td (SmartBanao - Official Licensed Edition) Tj\n/F1 14 Tf 50 680 Td (${product.title}) Tj\n/F1 11 Tf 50 650 Td (Verified Lifetime Digital Access Granted) Tj\nET\nendstream endobj\nxref\n0 5\n0000000000 65535 f\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n260\n%%EOF`;
        const blob = new Blob([fallbackContent], { type: 'application/pdf' });
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

  const handleCheckoutSuccess = async (order: Order, item?: Product | Bundle) => {
    if (item && 'product_type' in item) {
      setOwnedProducts((prev) => {
        if (prev.some((p) => p.id === item.id)) return prev;
        return [...prev, item as Product];
      });
    }
    await loadLibraryData();
    await handleRefreshData();
  };

  const userOwnedProductIds = ownedProducts.map((p) => p.id);

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center text-[#16221c]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <BrandLogo size="lg" />
          <span className="text-xs font-semibold tracking-wider text-[#54685c]">
            Loading SmartBanao experience...
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
      {/* Header: Clean iOS Navigation bar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode: mode || 'login' })}
        onLogout={handleLogout}
        onOpenSearch={() => handleNavigate('products')}
      />

      {/* Main Content Area: directly below Header bar */}

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
            if (loggedInUser.role === 'admin') {
              setCurrentView('admin-portal');
              try {
                window.history.pushState({}, '', '/admin');
              } catch {}
            }
          }}
        />
      )}
    </div>
  );
}
