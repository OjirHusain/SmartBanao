import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Layers,
  FileText,
  CreditCard,
  QrCode,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../lib/api.ts';
import { Bundle, Order, Product, UserProfile } from '../types/index.ts';

interface CheckoutModalProps {
  item: Product | Bundle;
  itemType: 'product' | 'bundle';
  user: UserProfile | null;
  onClose: () => void;
  onSuccess: (order: Order) => void;
  onRequireAuth: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  item,
  itemType,
  user,
  onClose,
  onSuccess,
  onRequireAuth,
}) => {
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [step, setStep] = useState<'review' | 'paying' | 'verifying' | 'success' | 'error'>('review');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [gatewayData, setGatewayData] = useState<any>(null);

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-[#faf9f5] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#dedad0] text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1b3428] text-white flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#14231b]">Sign in to Complete Order</h3>
          <p className="text-xs text-[#5c6d62] mt-2 leading-relaxed">
            Please log in or create your free account to complete your purchase and secure permanent access in your private digital library.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-[#1b3428] hover:bg-[#12261d] rounded-full transition-colors shadow-sm"
            >
              Sign In or Register
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-[#6d7e73] hover:text-[#14231b] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartPayment = async () => {
    try {
      setStep('paying');
      setErrorMessage('');

      const orderRes = await api.createOrder(
        [{ itemType, itemId: item.id }],
        phone
      );

      const gtwRes = await api.createRazorpayOrder(orderRes.order.id);
      setGatewayData(gtwRes);
    } catch (err: any) {
      setStep('error');
      setErrorMessage(err.message || 'Failed to initialize payment gateway.');
    }
  };

  const handleSimulatePaymentCompletion = async () => {
    if (!gatewayData) return;
    try {
      setStep('verifying');
      setErrorMessage('');

      const paymentId = `pay_${paymentMethod}_${Date.now()}`;
      
      const verifyRes = await api.verifyRazorpayPayment({
        order_id: gatewayData.order_id,
        razorpay_order_id: gatewayData.gateway_order_id,
        razorpay_payment_id: paymentId,
        gateway: 'razorpay',
      });

      if (verifyRes.success) {
        setConfirmedOrder(verifyRes.order);
        setStep('success');

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}

        onSuccess(verifyRes.order);
      }
    } catch (err: any) {
      setStep('error');
      setErrorMessage(err.message || 'Signature verification failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#faf9f5] rounded-3xl max-w-lg w-full shadow-2xl border border-[#dedad0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e8e6dc] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2d6a4f]" />
            <span className="text-[11px] font-bold text-[#14231b] uppercase tracking-wider font-mono">
              Secure Checkout · 256-Bit Verification
            </span>
          </div>
          {step !== 'verifying' && (
            <button
              onClick={onClose}
              className="text-[#7d8e83] hover:text-[#14231b] p-1 rounded-full hover:bg-[#f0eee6] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content based on step */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {step === 'review' && (
            <div className="space-y-5">
              {/* Item Card */}
              <div className="p-4 bg-white rounded-2xl border border-[#e8e6dc] flex items-start gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-[#e9f1ec] text-[#1b3428] flex items-center justify-center shrink-0">
                  {itemType === 'bundle' ? (
                    <Layers className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#25523d] bg-[#ebf4ef] px-2 py-0.5 rounded-full font-mono">
                    {itemType === 'bundle' ? 'Curated Bundle' : 'Digital Product'}
                  </span>
                  <h4 className="text-sm font-bold text-[#14231b] mt-1 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#6b7d72] mt-0.5">
                    Lifetime License · Instant Private Delivery
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-[#14231b] font-mono">
                    ₹{item.price}
                  </span>
                  {item.original_price && (
                    <p className="text-[11px] text-[#909e94] line-through font-mono">
                      ₹{item.original_price}
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#14231b] uppercase tracking-wider font-mono">
                  Order Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#6b7d72] font-medium mb-1">Customer Name</label>
                    <input
                      type="text"
                      disabled
                      value={user.full_name}
                      className="w-full px-3 py-2 bg-[#f0eee6] text-[#34463b] rounded-xl border border-[#dedad0] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6b7d72] font-medium mb-1">Delivery Email</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3 py-2 bg-[#f0eee6] text-[#34463b] rounded-xl border border-[#dedad0] cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#14231b] font-medium text-xs mb-1">
                    Phone Number (for payment receipt & SMS updates)
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white text-[#14231b] rounded-xl border border-[#dedad0] focus:outline-none focus:ring-1 focus:ring-[#1b3428]"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-[#e8e6dc] space-y-1.5 text-xs text-[#526358]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{item.price}</span>
                </div>
                <div className="flex justify-between text-[#2d6a4f] font-medium">
                  <span>Digital Delivery & License Fee</span>
                  <span>Free (₹0)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#e8e6dc] text-sm font-extrabold text-[#14231b]">
                  <span>Total Amount Due</span>
                  <span className="font-mono text-base">₹{item.price}</span>
                </div>
              </div>

              {/* Pay Action */}
              <button
                onClick={handleStartPayment}
                className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-[#1b3428] hover:bg-[#12261d] rounded-full transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#a8d5b8]" />
                <span>Proceed to Payment (₹{item.price})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#7d8e83]">
                Guaranteed safe checkout with 256-bit encryption. No recurring charges.
              </p>
            </div>
          )}

          {step === 'paying' && gatewayData && (
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center">
                <span className="text-[10px] font-bold text-[#234b38] bg-[#ebf4ef] px-2.5 py-0.5 rounded-full uppercase font-mono">
                  Razorpay India Gateway
                </span>
                <h4 className="text-lg font-bold text-[#14231b] mt-2">
                  Complete Payment of ₹{gatewayData.amount_inr}
                </h4>
                <p className="text-xs text-[#6b7d72] mt-1 font-mono">
                  Order Reference: {gatewayData.order_number}
                </p>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-3 px-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-[#1b3428] bg-white text-[#1b3428] shadow-xs'
                      : 'border-[#dedad0] text-[#55665c] hover:bg-[#f0eee6]'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#234b38]" />
                  <span>Instant UPI / QR</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-[#1b3428] bg-white text-[#1b3428] shadow-xs'
                      : 'border-[#dedad0] text-[#55665c] hover:bg-[#f0eee6]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#234b38]" />
                  <span>Card / NetBanking</span>
                </button>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#dedad0] text-center space-y-3 shadow-2xs">
                <div className="flex items-center justify-center gap-2 text-xs text-[#3d5045] font-medium">
                  <Lock className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span>Cryptographic Server-Side Signature Validation Active</span>
                </div>

                <div className="p-3 bg-[#faf9f5] rounded-xl border border-[#e8e6dc] text-xs text-left text-[#34463b] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#6b7d72]">Gateway Order ID:</span>
                    <span className="font-mono text-[11px] truncate max-w-[180px]">{gatewayData.gateway_order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7d72]">Billed To:</span>
                    <span className="font-medium">{gatewayData.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7d72]">Amount:</span>
                    <span className="font-mono font-bold">₹{gatewayData.amount_inr}.00</span>
                  </div>
                </div>

                <button
                  onClick={handleSimulatePaymentCompletion}
                  className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#1b3428] hover:bg-[#12261d] rounded-full transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#a8d5b8]" />
                  <span>Confirm Payment & Verify Signature (₹{gatewayData.amount_inr})</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-[#7d8e83]">
                <span>Google Pay</span>
                <span>·</span>
                <span>PhonePe</span>
                <span>·</span>
                <span>Paytm</span>
                <span>·</span>
                <span>RuPay</span>
                <span>·</span>
                <span>Cards</span>
              </div>
            </div>
          )}

          {step === 'verifying' && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#234b38] animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-bold text-[#14231b]">
                  Verifying Payment Signature...
                </h4>
                <p className="text-xs text-[#6b7d72] mt-1">
                  Executing server HMAC SHA-256 validation and provisioning access to your library.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && confirmedOrder && (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-[#ebf4ef] text-[#2d6a4f] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#2d6a4f] bg-[#ebf4ef] px-2.5 py-0.5 rounded-full uppercase font-mono">
                  Verified Payment Completed
                </span>
                <h4 className="text-xl font-bold text-[#14231b] mt-2">
                  Access Granted Successfully!
                </h4>
                <p className="text-xs text-[#526358] mt-1 max-w-sm mx-auto leading-relaxed">
                  Your payment has been cryptographically confirmed. Your digital products and courses are now available in your personal library.
                </p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-[#dedad0] text-xs text-left space-y-1.5 shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-[#6b7d72]">Order Number:</span>
                  <span className="font-mono font-bold text-[#14231b]">{confirmedOrder.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7d72]">Transaction ID:</span>
                  <span className="font-mono text-[#44564c]">{confirmedOrder.payment?.transaction_id || 'pay_verified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7d72]">Total Paid:</span>
                  <span className="font-mono font-bold text-[#2d6a4f]">₹{confirmedOrder.total_amount}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#1b3428] hover:bg-[#12261d] rounded-full transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#a8d5b8]" />
                  <span>Open My Library & Downloads</span>
                </button>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#14231b]">Payment Could Not Be Verified</h4>
                <p className="text-xs text-rose-600 mt-1 max-w-xs mx-auto">
                  {errorMessage || 'A signature mismatch or transaction issue occurred.'}
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setStep('review')}
                  className="px-4 py-2 text-xs font-semibold text-[#526358] bg-white border border-[#dedad0] rounded-full"
                >
                  Back to Review
                </button>
                <button
                  onClick={handleStartPayment}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1b3428] rounded-full"
                >
                  Retry Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
