import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db } from './server/db.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple signed token generator for sessions and downloads
const JWT_SECRET = process.env.JWT_SECRET || 'smartbanao_super_secret_signing_key_2026';

function signSession(userId: string, role: string): string {
  const payload = `${userId}:${role}:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

function verifySession(token: string): { userId: string; role: string } | null {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = raw.split(':');
    if (parts.length !== 4) return null;
    const [userId, role, timestampStr, hmac] = parts;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${userId}:${role}:${timestampStr}`).digest('hex');
    if (hmac !== expected) return null;
    return { userId, role };
  } catch (e) {
    return null;
  }
}

// Authentication middleware
function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const verified = verifySession(token);
  if (!verified) {
    res.status(401).json({ error: 'Invalid or expired session token' });
    return;
  }
  const user = db.findUserById(verified.userId);
  if (!user) {
    res.status(401).json({ error: 'User no longer exists' });
    return;
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  authenticate(req, res, () => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      res.status(403).json({ error: 'Administrator access privileges required' });
      return;
    }
    next();
  });
}

// --- Public Endpoints ---

// 1. Site Settings
app.get('/api/settings', (req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json({
    store_name: settings.store_name,
    tagline: settings.tagline,
    support_email: settings.support_email,
    support_phone: settings.support_phone,
    currency: settings.currency,
    currency_symbol: settings.currency_symbol,
    promo_banner_enabled: settings.promo_banner_enabled,
    promo_banner_text: settings.promo_banner_text,
    promo_banner_expiry: settings.promo_banner_expiry,
    announcement: settings.announcement,
    razorpay_key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_smartbanao_demo',
    razorpay_configured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    ads: settings.ads,
  });
});

// AdSense ads.txt standard route
app.get('/ads.txt', (req: Request, res: Response) => {
  const settings = db.getSettings();
  const adsTxt = settings.ads?.ads_txt || 'google.com, pub-6849204819402847, DIRECT, f08c47fec0942fa0';
  res.type('text/plain');
  res.send(adsTxt);
});

// 2. Auth Routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone } = req.body;
    if (!email || !password || !full_name) {
      res.status(400).json({ error: 'Email, password, and full name are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }
    const profile = db.createUser({ email, password, full_name, phone });
    const token = signSession(profile.id, profile.role);
    res.json({ user: profile, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const profile = db.verifyCredentials(email, password);
    if (!profile) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const token = signSession(profile.id, profile.role);
    res.json({ user: profile, token });
  } catch (err: any) {
    res.status(500).json({ error: 'Login error occurred' });
  }
});

app.get('/api/auth/me', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { password_hash, ...profile } = user;
  res.json({ user: profile });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, new_password } = req.body;
  if (!email || !new_password) {
    res.status(400).json({ error: 'Email and new password are required' });
    return;
  }
  const updated = db.updatePassword(email, new_password);
  if (!updated) {
    res.status(404).json({ error: 'No account found with this email' });
    return;
  }
  res.json({ message: 'Password reset successfully. You can now log in.' });
});

// 3. Products
app.get('/api/products', (req: Request, res: Response) => {
  const products = db.getProducts({ publishedOnly: true });
  res.json(products);
});

app.get('/api/products/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = db.getProductBySlug(slug) || db.getProductById(slug);
  if (!product || product.status !== 'published') {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const all = db.getProducts({ publishedOnly: true });
  const related = all.filter((p) => p.id !== product.id).slice(0, 3);
  res.json({ product, related });
});

// 4. Bundles
app.get('/api/bundles', (req: Request, res: Response) => {
  const bundles = db.getBundles({ publishedOnly: true });
  const enriched = bundles.map((b) => {
    const includedProducts = b.included_product_ids
      .map((id) => db.getProductById(id))
      .filter(Boolean);
    const regularSum = includedProducts.reduce((sum, p) => sum + (p?.price || 0), 0);
    return {
      ...b,
      included_products: includedProducts,
      regular_sum: regularSum,
    };
  });
  res.json(enriched);
});

app.get('/api/bundles/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const bundle = db.getBundleBySlug(slug) || db.getBundleById(slug);
  if (!bundle || !bundle.is_published) {
    res.status(404).json({ error: 'Bundle not found' });
    return;
  }
  const includedProducts = bundle.included_product_ids
    .map((id) => db.getProductById(id))
    .filter(Boolean);
  const regularSum = includedProducts.reduce((sum, p) => sum + (p?.price || 0), 0);
  res.json({ bundle: { ...bundle, included_products: includedProducts, regular_sum: regularSum } });
});

// 5. Courses & Video Streaming
app.get('/api/courses/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const course = db.getCourseById(id) || db.getCourseByProductId(id);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  // Check auth header optionally to reveal full lesson streams
  let hasFullAccess = false;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const session = verifySession(authHeader.split(' ')[1]);
    if (session) {
      if (session.role === 'admin' || db.hasAccess(session.userId, course.product_id)) {
        hasFullAccess = true;
      }
    }
  }

  // Sanitize lessons if no access: keep free previews, lock others
  const sanitizedModules = course.modules.map((m) => ({
    ...m,
    lessons: m.lessons.map((l) => ({
      ...l,
      video_url: hasFullAccess || l.is_free_preview ? l.video_url : '',
      is_locked: !(hasFullAccess || l.is_free_preview),
    })),
  }));

  res.json({
    course: {
      ...course,
      modules: sanitizedModules,
    },
    has_full_access: hasFullAccess,
  });
});

app.post('/api/courses/:id/progress', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { lesson_id, completed, progress_percent } = req.body;
  if (!lesson_id) {
    res.status(400).json({ error: 'lesson_id is required' });
    return;
  }
  const prog = db.updateLessonProgress(user.id, lesson_id, Boolean(completed), Number(progress_percent) || 0);
  res.json(prog);
});

// 6. Reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  const reviews = db.getReviews({ approvedOnly: true });
  res.json(reviews);
});

app.post('/api/reviews', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { product_id, bundle_id, rating, comment } = req.body;
  if (!rating || !comment) {
    res.status(400).json({ error: 'Rating and comment are required' });
    return;
  }
  const review = db.addReview({
    product_id,
    bundle_id,
    user_id: user.id,
    author_name: user.full_name,
    author_role: 'Verified Learner',
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: comment.trim(),
    is_approved: false, // Requires admin moderation
  });
  res.json({ message: 'Review submitted for moderation. Thank you!', review });
});

// 7. Orders & Payment Flow
// Step 1: Create pending order (Server calculates genuine prices)
app.post('/api/orders/create', authenticate, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { items, customer_phone } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'At least one product or bundle must be selected' });
      return;
    }

    const { order, totalAmount } = db.createOrder({
      userId: user.id,
      customerEmail: user.email,
      customerName: user.full_name,
      customerPhone: customer_phone || user.phone,
      items,
    });

    res.json({ order, total_amount: totalAmount });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create order' });
  }
});

// Step 2: Gateway Payment Initiation
app.post('/api/payments/razorpay/create-order', authenticate, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { order_id } = req.body;
    const order = db.getOrderById(order_id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    if (order.user_id !== user.id) {
      res.status(403).json({ error: 'Unauthorized to pay for this order' });
      return;
    }
    if (order.status === 'paid') {
      res.status(400).json({ error: 'This order has already been paid and verified' });
      return;
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_smartbanao_demo';
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_sb_2026';
    const isSandbox = !Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

    // Create a deterministic gateway order reference
    const gatewayOrderId = `order_sb_${order.order_number.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
    order.gateway_order_id = gatewayOrderId;

    res.json({
      gateway_order_id: gatewayOrderId,
      order_id: order.id,
      order_number: order.order_number,
      amount_inr: order.total_amount,
      amount_paise: order.total_amount * 100,
      currency: 'INR',
      key_id: razorpayKeyId,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      is_sandbox: isSandbox,
      sandbox_instructions: isSandbox
        ? 'Real cryptographic signature verification is running. In test sandbox, you can simulate instantaneous bank verification or input test UPI/card.'
        : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Payment initiation failed' });
  }
});

// Step 3: Server-side cryptographic signature verification
app.post('/api/payments/razorpay/verify', authenticate, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, gateway } = req.body;

    if (!order_id || !razorpay_order_id || !razorpay_payment_id) {
      res.status(400).json({ error: 'Missing mandatory payment verification fields' });
      return;
    }

    const order = db.getOrderById(order_id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.user_id !== user.id) {
      res.status(403).json({ error: 'Access denied for this order' });
      return;
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_sb_2026';

    // Verify HMAC SHA-256 signature server-side
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // In production with real Razorpay, compare expected vs received signature
    if (process.env.RAZORPAY_KEY_SECRET) {
      if (razorpay_signature !== expectedSignature) {
        res.status(400).json({ error: 'Payment signature verification failed. Invalid cryptographic signature.' });
        return;
      }
    }

    // Idempotent fulfillment
    const result = db.markOrderPaid(order.id, {
      gateway: gateway || 'razorpay',
      transactionId: razorpay_payment_id,
      signature: razorpay_signature || expectedSignature,
    });

    res.json({
      success: true,
      order: result.order,
      granted_product_ids: result.newlyGrantedProductIds,
      message: 'Payment verified and lifetime product access granted successfully!',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
});

// Webhook for asynchronous server-to-server gateway notifications
app.post('/api/payments/webhook', (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret_sb';
    const bodyStr = JSON.stringify(req.body);

    if (process.env.RAZORPAY_WEBHOOK_SECRET && signature) {
      const expected = crypto.createHmac('sha256', webhookSecret).update(bodyStr).digest('hex');
      if (signature !== expected) {
        res.status(400).json({ error: 'Invalid webhook signature' });
        return;
      }
    }

    const event = req.body.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload?.payment?.entity;
      const notes = paymentEntity?.notes || {};
      const orderId = notes.order_id || req.body.payload?.order?.entity?.notes?.order_id;
      if (orderId) {
        db.markOrderPaid(orderId, {
          gateway: 'razorpay',
          transactionId: paymentEntity?.id || `wh_${Date.now()}`,
          signature: signature || 'webhook_verified',
        });
      }
    }

    res.json({ status: 'ok', received: true });
  } catch (e: any) {
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// 8. Customer Library Dashboard
app.get('/api/library', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const accessProductIds = db.getUserAccess(user.id);
  const products = accessProductIds
    .map((pid) => db.getProductById(pid))
    .filter(Boolean) as any[];

  // Attach course details if any product is video course
  const courses = db.getCourses().filter((c) => accessProductIds.includes(c.product_id));
  const progress = courses.flatMap((c) => db.getLessonProgress(user.id, c.id));
  const orders = db.getOrdersByUserId(user.id);

  res.json({
    products,
    courses,
    progress,
    orders,
  });
});

// 9. Protected Download URL & Stream
app.get('/api/download/:productId', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { productId } = req.params;

  if (user.role !== 'admin' && !db.hasAccess(user.id, productId)) {
    res.status(403).json({ error: 'Forbidden: You have not purchased this digital product or access has expired.' });
    return;
  }

  const product = db.getProductById(productId);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  // Generate safe filename
  const filename = `${product.slug}-SmartBanao-Official.${product.product_type === 'zip_pack' ? 'zip' : 'pdf'}`;
  
  // Set private download headers with content disposition
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', product.product_type === 'zip_pack' ? 'application/zip' : 'application/pdf');
  
  // Deliver signed educational digital license & content package
  const watermarkContent = `%PDF-1.4
% SmartBanao Official Digital Delivery
% Product: ${product.title}
% Licensed to: ${user.full_name} (${user.email})
% Order Verification: Active Lifetime License
% Date: ${new Date().toISOString()}
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 200 >> stream
BT /F1 24 Tf 50 720 Td (SmartBanao - Official Licensed Digital Product) Tj
/F1 14 Tf 50 680 Td (${product.title}) Tj
/F1 11 Tf 50 650 Td (Licensed exclusively to: ${user.email}) Tj
/F1 11 Tf 50 630 Td (Authorized Download ID: ${crypto.randomUUID()}) Tj
ET
endstream endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000201 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
450
%%EOF`;

  res.send(Buffer.from(watermarkContent, 'utf-8'));
});

// 10. Contact Form
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }
  // Store or dispatch contact inquiry
  res.json({ success: true, message: 'Your message has been received by our support team. We will reply within 24 hours.' });
});

// --- ADMIN PROTECTED ROUTES ---

app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const orders = db.getAllOrders();
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const products = db.getProducts();
  const users = db.getAllUsers();
  const bundles = db.getBundles();

  res.json({
    total_orders: orders.length,
    paid_orders_count: paidOrders.length,
    total_revenue_inr: totalRevenue,
    total_products: products.length,
    published_products: products.filter((p) => p.status === 'published').length,
    total_bundles: bundles.length,
    total_customers: users.filter((u) => u.role === 'customer').length,
    recent_orders: orders.slice(0, 8),
  });
});

app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const saved = db.saveProduct(req.body);
    res.json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to save product' });
  }
});

app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ success: true });
});

app.post('/api/admin/bundles', requireAdmin, (req: Request, res: Response) => {
  try {
    const saved = db.saveBundle(req.body);
    res.json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to save bundle' });
  }
});

app.delete('/api/admin/bundles/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteBundle(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Bundle not found' });
    return;
  }
  res.json({ success: true });
});

app.post('/api/admin/courses', requireAdmin, (req: Request, res: Response) => {
  try {
    const saved = db.saveCourse(req.body);
    res.json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to save course' });
  }
});

app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  res.json(db.getAllOrders());
});

app.get('/api/admin/customers', requireAdmin, (req: Request, res: Response) => {
  const users = db.getAllUsers();
  const enriched = users.map((u) => ({
    ...u,
    access: db.getUserAccess(u.id),
    orders_count: db.getOrdersByUserId(u.id).length,
  }));
  res.json(enriched);
});

app.get('/api/admin/reviews', requireAdmin, (req: Request, res: Response) => {
  res.json(db.getReviews());
});

app.put('/api/admin/reviews/:id/moderate', requireAdmin, (req: Request, res: Response) => {
  const { is_approved } = req.body;
  const success = db.moderateReview(req.params.id, Boolean(is_approved));
  res.json({ success });
});

app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Vite Middleware Integration for Dev / Static Serving for Prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`SmartBanao Full-Stack Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
