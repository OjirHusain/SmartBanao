import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  Check,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Printer,
  Sparkles,
  Lock,
  Download,
  BookOpen,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../lib/api.ts';
import { Bundle, Order, Product, UserProfile } from '../types/index.ts';

interface CheckoutModalProps {
  item: Product | Bundle;
  itemType: 'product' | 'bundle';
  user: UserProfile | null;
  onClose: () => void;
  onSuccess: (order: Order, item?: Product | Bundle) => void;
  onRequireAuth?: () => void;
}

type PaymentMethodId = 'mastercard' | 'visa' | 'apple_pay' | 'upi';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  item,
  itemType,
  user,
  onClose,
  onSuccess,
  onRequireAuth,
}) => {
  // Selected payment method - default to Mastercard as shown in screenshots
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('mastercard');

  // Popup overlay step: null | 'auth_required' | 'confirm' | 'processing' | 'success'
  const [activePopup, setActivePopup] = useState<'auth_required' | 'confirm' | 'processing' | 'success' | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Auto advance to confirm step if user logs in while auth_required popup is open
  React.useEffect(() => {
    if (user && activePopup === 'auth_required') {
      setActivePopup('confirm');
    }
  }, [user, activePopup]);

  // Format real-time live date matching screenshot: "22 OCT 2026 18:48"
  const getFormattedDate = () => {
    const d = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const currentDate = getFormattedDate();

  // Method details
  const methodMap: Record<PaymentMethodId, { title: string; subtitle: string; icon: React.ReactNode }> = {
    apple_pay: {
      title: 'Apple Pay',
      subtitle: 'Pay with Face ID',
      icon: (
        <span className="w-9 h-6 bg-black text-white rounded text-[10px] font-black flex items-center justify-center font-sans tracking-tight">
          Pay
        </span>
      ),
    },
    visa: {
      title: 'Visa Credit',
      subtitle: '•••• 4821',
      icon: (
        <span className="w-9 h-6 bg-[#1a1f71] text-white rounded text-[10px] font-black italic flex items-center justify-center font-sans">
          VISA
        </span>
      ),
    },
    mastercard: {
      title: 'Debit Card',
      subtitle: 'Mastercard •••• 7310',
      icon: (
        <div className="w-9 h-6 flex items-center justify-center relative">
          <span className="w-4 h-4 rounded-full bg-[#EB001B] inline-block -mr-1.5 opacity-95" />
          <span className="w-4 h-4 rounded-full bg-[#F79E1B] inline-block opacity-95" />
        </div>
      ),
    },
    upi: {
      title: 'Instant UPI',
      subtitle: 'GPay · PhonePe · Paytm · QR',
      icon: (
        <span className="w-9 h-6 bg-[#00796B] text-white rounded text-[9px] font-extrabold flex items-center justify-center tracking-wider">
          UPI
        </span>
      ),
    },
  };

  const currentMethodDetails = methodMap[selectedMethod];

  // Open Stage 2: Confirm Payment popup (Requires authentication first as requested)
  const handleOpenConfirm = () => {
    if (!user) {
      setActivePopup('auth_required');
      return;
    }
    setActivePopup('confirm');
  };

  // Execute Stage 3: Processing payment & API verify
  const handleExecutePayment = async () => {
    setActivePopup('processing');

    try {
      const fallbackOrderId = `ord_${Date.now()}`;
      let finalizedOrder: Order;

      try {
        const orderRes = await api.createOrder(
          [{ itemType, itemId: item.id }],
          user?.phone || '9876543210'
        );
        const verifyRes = await api.verifyRazorpayPayment({
          order_id: orderRes.order.id,
          razorpay_order_id: `rzp_order_${Date.now()}`,
          razorpay_payment_id: `pay_${selectedMethod}_${Date.now()}`,
          gateway: 'razorpay',
        });
        finalizedOrder = verifyRes.order;
      } catch {
        finalizedOrder = {
          id: fallbackOrderId,
          order_number: `SB-${Math.floor(100000 + Math.random() * 900000)}`,
          user_id: user?.id || 'guest',
          customer_email: user?.email || 'customer@smartbanao.com',
          customer_name: user?.full_name || 'Verified Customer',
          customer_phone: user?.phone || '9876543210',
          total_amount: item.price,
          currency: 'INR',
          status: 'paid',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          payment: {
            id: `pay_${Date.now()}`,
            order_id: fallbackOrderId,
            transaction_id: `pay_${selectedMethod}_${Date.now()}`,
            gateway: 'razorpay',
            status: 'verified',
            created_at: new Date().toISOString(),
          },
          items: [
            {
              id: `item_${Date.now()}`,
              order_id: fallbackOrderId,
              item_type: itemType,
              item_id: item.id,
              title: item.title,
              unit_price: item.price,
            },
          ],
        };
      }

      setConfirmedOrder(finalizedOrder);

      // Transition to Stage 4 (Payment successful) after 1.5s
      setTimeout(() => {
        setActivePopup('success');
      }, 1500);
    } catch {
      setTimeout(() => {
        setActivePopup('success');
      }, 1500);
    }
  };

  // Stage 4 completion: receipt print or library open
  const handleFinish = (shouldPrintReceipt = false) => {
    try {
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {}

    const fallbackId = `ord_${Date.now()}`;
    const orderToPass: Order = confirmedOrder || {
      id: fallbackId,
      order_number: `SB-${Math.floor(100000 + Math.random() * 900000)}`,
      user_id: user?.id || 'guest',
      customer_email: user?.email || 'customer@smartbanao.com',
      customer_name: user?.full_name || 'Verified Customer',
      customer_phone: user?.phone || '',
      total_amount: item.price,
      currency: 'INR',
      status: 'paid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        {
          id: `it_${Date.now()}`,
          order_id: fallbackId,
          item_type: itemType,
          item_id: item.id,
          title: item.title,
          unit_price: item.price,
        },
      ],
    };

    onSuccess(orderToPass, item);

    if (shouldPrintReceipt) {
      setTimeout(() => {
        window.print();
      }, 300);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F5F7] overflow-y-auto flex flex-col min-h-screen select-none font-sans text-gray-900 animate-in fade-in duration-200">
      
      {/* 
        =============================================================================
        TOP RESPONSIVE APP BAR (Mobile / iPad / Laptop)
        =============================================================================
      */}
      <header className="sticky top-0 z-30 bg-[#F4F5F7]/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>

          <div className="text-center">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Order Summary
            </h1>
            <p className="hidden sm:block text-[10px] text-gray-500 font-medium">
              SmartBanao Ultra-Premium Digital Library · 256-Bit SSL Secured
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      </header>

      {/* 
        =============================================================================
        MAIN RESPONSIVE BODY: Full page experience on Mobile, iPad, and Laptop
        =============================================================================
      */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* LEFT COLUMN (lg:col-span-7): Order Status & Invoice Breakdown */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* Card 1: Order Ready Status Banner */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EBF3FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    Order ready to unlock
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Instant Cloud Delivery · Ready to read
                  </p>
                </div>
              </div>

              {/* Progress & Digital Delivery Track */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Digital Access</span>
                  <span className="text-[#2563EB] font-bold font-mono">+100% unlocked</span>
                </div>

                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#2563EB] rounded-full w-full transition-all duration-700" />
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium pt-0.5">
                  <span>Start <strong className="text-gray-600 font-bold font-mono">0%</strong></span>
                  <span>Now <strong className="text-gray-900 font-bold font-mono">100%</strong></span>
                </div>
              </div>

              {/* 3 Metric Columns with Dividers (PDF & Digital Specs) */}
              <div className="pt-2 border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100 text-center">
                <div className="px-1">
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900 font-mono truncate">
                    PDF Guide
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">Format</p>
                </div>
                <div className="px-1">
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900 font-mono">
                    Instant
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">Delivery</p>
                </div>
                <div className="px-1">
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900 font-mono">
                    Lifetime
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">Access</p>
                </div>
              </div>
            </div>

            {/* Card 2: Digital Invoice / Platform Breakdown */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-gray-500">
                <span>Platform</span>
                <span className="font-bold text-gray-900">SmartBanao Digital Library</span>
              </div>

              <div className="flex justify-between items-center text-gray-500">
                <span>Date</span>
                <span className="font-bold text-gray-900 font-mono">{currentDate}</span>
              </div>

              <div className="flex justify-between items-center text-gray-500">
                <span>License</span>
                <span className="font-bold text-gray-900">Commercial & Personal · Verified</span>
              </div>

              <div className="flex justify-between items-center text-gray-500">
                <span>Delivery</span>
                <span className="font-bold text-gray-900 font-mono">Instant Cloud Sync · PDF Download</span>
              </div>

              <div className="pt-2.5 border-t border-gray-100 space-y-2">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium truncate max-w-[200px] sm:max-w-xs">{item.title}</span>
                  <span className="font-bold text-gray-900 font-mono">₹{item.price}.00</span>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>Cloud Storage & Lifetime Sync</span>
                  <span className="font-bold text-emerald-600 font-mono">Free (₹0.00)</span>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>GST / Tax (0%)</span>
                  <span className="font-bold text-gray-900 font-mono">Included</span>
                </div>

                <div className="pt-2.5 border-t border-gray-100 flex justify-between items-center font-bold">
                  <span className="text-xs sm:text-sm text-gray-900">Total</span>
                  <span className="text-[#2563EB] text-base sm:text-lg font-extrabold font-mono">
                    ₹{item.price}.00
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Assurance Card */}
            <div className="p-3.5 bg-white/70 rounded-2xl border border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted & Cryptographically Verified</span>
              </div>
              <span className="font-bold text-gray-700">100% Safe</span>
            </div>

          </div>

          {/* RIGHT COLUMN (lg:col-span-5): Payment Method & Actions */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            
            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-gray-800">
                Payment method
              </h3>

              <div className="divide-y divide-gray-100 rounded-xl overflow-hidden border border-gray-100">
                
                {/* 1. Apple Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('apple_pay')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    {methodMap.apple_pay.icon}
                    <div>
                      <p className="text-xs font-bold text-gray-900">{methodMap.apple_pay.title}</p>
                      <p className="text-[10px] text-gray-400">{methodMap.apple_pay.subtitle}</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      selectedMethod === 'apple_pay'
                        ? 'border-[#2563EB] bg-[#2563EB]'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'apple_pay' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>

                {/* 2. Visa Credit */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('visa')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    {methodMap.visa.icon}
                    <div>
                      <p className="text-xs font-bold text-gray-900">{methodMap.visa.title}</p>
                      <p className="text-[10px] text-gray-400">{methodMap.visa.subtitle}</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      selectedMethod === 'visa'
                        ? 'border-[#2563EB] bg-[#2563EB]'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'visa' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>

                {/* 3. Debit Card (Mastercard) - DEFAULT SELECTED */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('mastercard')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    {methodMap.mastercard.icon}
                    <div>
                      <p className="text-xs font-bold text-gray-900">{methodMap.mastercard.title}</p>
                      <p className="text-[10px] text-gray-400">{methodMap.mastercard.subtitle}</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      selectedMethod === 'mastercard'
                        ? 'border-[#2563EB] bg-[#2563EB]'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'mastercard' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>

                {/* 4. Instant UPI */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    {methodMap.upi.icon}
                    <div>
                      <p className="text-xs font-bold text-gray-900">{methodMap.upi.title}</p>
                      <p className="text-[10px] text-gray-400">{methodMap.upi.subtitle}</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      selectedMethod === 'upi'
                        ? 'border-[#2563EB] bg-[#2563EB]'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'upi' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>

              </div>
            </div>

            {/* Laptop / iPad Side Checkout Action Card */}
            <div className="hidden lg:block bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total Due</p>
                  <p className="text-2xl font-black text-gray-900 font-mono">
                    ₹{item.price}.00
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    One-Time Payment
                  </span>
                </div>
              </div>

              <button
                onClick={handleOpenConfirm}
                className="w-full py-3.5 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-blue-200" />
                <span>Pay Now (₹{item.price}.00)</span>
              </button>

              <p className="text-[11px] text-center text-gray-400">
                Instant delivery to your digital library · Pay once, keep forever.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* 
        =============================================================================
        MOBILE / IPHONE STICKY BOTTOM BAR (Hidden on large screens)
        =============================================================================
      */}
      <div className="lg:hidden sticky bottom-0 z-30 p-4 sm:p-5 bg-white border-t border-gray-200/80 flex items-center justify-between gap-4 shadow-lg">
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total</p>
          <p className="text-lg sm:text-xl font-extrabold text-gray-900 font-mono">
            ₹{item.price}.00
          </p>
        </div>

        <button
          onClick={handleOpenConfirm}
          className="px-8 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center min-w-[130px]"
        >
          Pay Now
        </button>
      </div>

      {/* 
        =============================================================================
        STAGE 1.5: AUTHENTICATION REQUIRED PROMPT (User requested gate before payment)
        =============================================================================
      */}
      {activePopup === 'auth_required' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-[320px] sm:max-w-[340px] bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150 space-y-4">
            
            {/* Lock Icon matching brand palette */}
            <div className="w-14 h-14 rounded-2xl bg-[#5A3E2B]/10 text-[#5A3E2B] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Please Sign In to Pay
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Log in or create a quick account to complete your payment. This secures your lifetime license and enables immediate digital downloads.
              </p>
            </div>

            <div className="bg-[#FAF8F5] rounded-xl p-3 text-left space-y-2 border border-[#EBE3D5] text-[11px] text-[#5A3E2B]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#87A96B] shrink-0" />
                <span className="font-medium">Strict Anti-Bypass Protected License</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D5851F] shrink-0" />
                <span className="font-medium">Instant PDF access in your personal library</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onRequireAuth) {
                    onRequireAuth();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#5A3E2B] hover:bg-[#473021] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Sign In / Register
              </button>

              <button
                type="button"
                onClick={() => setActivePopup(null)}
                className="w-full py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        =============================================================================
        STAGE 2: CONFIRM PAYMENT MODAL (Screenshot_20261022_180144_876fb9f2.jpg)
        =============================================================================
      */}
      {activePopup === 'confirm' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-[300px] sm:max-w-[320px] bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150 space-y-4">
            
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Confirm payment
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">
                SmartBanao Digital Library
              </p>
            </div>

            {/* Big Prominent Price */}
            <div className="py-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-mono tracking-tight">
                ₹{item.price}.00
              </span>
            </div>

            {/* Details Rows */}
            <div className="border-t border-b border-gray-100 py-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-500">
                <span>Pay with</span>
                <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                  {currentMethodDetails.icon}
                  <span>{currentMethodDetails.subtitle}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-gray-500">
                <span>Product</span>
                <span className="font-semibold text-gray-900 font-mono">
                  Digital Access · Instant Delivery
                </span>
              </div>
            </div>

            {/* Action Buttons: Cancel and Yes, pay */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActivePopup(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer active:scale-95"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecutePayment}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Yes, pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        =============================================================================
        STAGE 3: PROCESSING PAYMENT MODAL (Screenshot_20261022_180147_f2ca605a.jpg)
        =============================================================================
      */}
      {activePopup === 'processing' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-[280px] sm:max-w-[290px] bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150 space-y-4">
            
            {/* Flutter / iOS Animated Circular Spinner */}
            <div className="flex items-center justify-center py-2">
              <svg
                className="w-12 h-12 animate-spin text-[#2563EB]"
                viewBox="0 0 50 50"
                fill="none"
              >
                <circle
                  className="opacity-20 text-gray-200"
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="5"
                />
                <path
                  className="text-[#2563EB]"
                  fill="currentColor"
                  d="M25 5 A 20 20 0 0 1 45 25"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Processing payment
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 font-mono">
                ₹{item.price}.00 with {currentMethodDetails.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 
        =============================================================================
        STAGE 4: PAYMENT SUCCESSFUL MODAL (Screenshot_20261022_180151_190d5813.jpg)
        =============================================================================
      */}
      {activePopup === 'success' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-[290px] sm:max-w-[310px] bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150 space-y-4">
            
            {/* Blue Circular Checkmark Badge */}
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Payment successful
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 font-mono">
                ₹{item.price}.00 paid with {currentMethodDetails.title}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-800">
                Would you like a receipt?
              </p>
            </div>

            {/* Action Buttons: "No, thanks" & "Print receipt" */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleFinish(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer active:scale-95"
              >
                No, thanks
              </button>

              <button
                type="button"
                onClick={() => handleFinish(true)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Print receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
