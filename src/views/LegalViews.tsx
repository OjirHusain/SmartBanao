import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api.ts';

interface LegalPageProps {
  page: 'privacy' | 'terms' | 'refund' | 'disclaimer' | 'about' | 'contact';
  onNavigate: (view: string) => void;
}

export const LegalViews: React.FC<LegalPageProps> = ({ page, onNavigate }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'General Question regarding Digital Product',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendContact(contactForm);
      setSubmitted(true);
    } catch {
      alert('Failed to send inquiry. Please reach out to support@smartbanao.com directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {page === 'privacy' && (
        <article className="prose prose-slate max-w-none space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Legal Notice</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Effective Date: October 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When you purchase or register on SmartBanao, we collect only the personal details necessary to provision your digital purchases and generate legitimate license keys: your name, email address, and optional phone number. We never store credit or debit card numbers on our servers. All transaction processing is encrypted and handled by authorized payment gateways (e.g. Razorpay).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. How Your Information Is Used</h2>
            <p>
              Your email is used to verify account authentication, generate signed download tokens for private storage, and send order confirmation receipts. We do not sell or monetize personal customer records to third-party ad networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Data Security & Storage</h2>
            <p>
              We implement PostgreSQL Row Level Security (RLS) policies and cryptographically signed session tokens. Customer libraries and download authorizations are protected and restricted to authenticated owners.
            </p>
          </section>
        </article>
      )}

      {page === 'terms' && (
        <article className="prose prose-slate max-w-none space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Terms of Service</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Terms and Conditions</h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Digital Products & One-Time Access</h2>
            <p>
              SmartBanao provides digital educational resources, e-books, PDF toolkits, design templates, and video courses. Products and Bundles (such as Bundle A and Bundle B) are one-time digital purchases. We do not operate recurring subscription billing unless explicitly identified.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. License Grant & Commercial Use</h2>
            <p>
              Purchasers receive a perpetual, non-exclusive, non-transferable personal and commercial license to implement templates, contract blueprints, and techniques in client and individual projects. Re-distributing, reselling, or re-publishing the raw digital source files as a competing marketplace item is strictly prohibited.
            </p>
          </section>
        </article>
      )}

      {page === 'refund' && (
        <article className="prose prose-slate max-w-none space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Purchase Protection</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Refund & Access Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Standard Digital Goods Policy</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Instant Digital Fulfillment</h2>
            <p>
              Due to the immediate, irreversible digital delivery of downloadable assets (PDFs, ZIP archives, templates) and instantaneous streaming access to online video modules, all sales are considered final once payment is verified.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. Technical Delivery Issues & Remediation</h2>
            <p>
              If you encounter any difficulty accessing your purchased materials, file corruption, or transaction discrepancies, our support team will regenerate your download authorizations or manually resolve your access within 24 business hours. Contact us at <a href="mailto:support@smartbanao.com" className="text-sky-600 underline">support@smartbanao.com</a>.
            </p>
          </section>
        </article>
      )}

      {page === 'disclaimer' && (
        <article className="prose prose-slate max-w-none space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Transparency</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Digital Product Disclaimer</h1>
            <p className="text-xs text-slate-500 mt-1">Educational & Informational Notice</p>
          </div>

          <section className="space-y-3">
            <p>
              The guides, code templates, contracts, and video lectures provided on SmartBanao are created strictly for educational and informational development. We make no guarantees of specific income, earnings, or job placement. Your career, freelance, or commercial outcomes depend on your own diligence, experience, and execution.
            </p>
            <p>
              Contract templates are provided as starting structural references. While drafted with legal best practices, you should consult qualified local legal counsel for specific jurisdictional compliance.
            </p>
          </section>
        </article>
      )}

      {page === 'about' && (
        <article className="prose prose-slate max-w-none space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">About Us</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">About SmartBanao</h1>
            <p className="text-xs text-slate-500 mt-1">"Learn Smart. Create More. Achieve More."</p>
          </div>

          <p>
            SmartBanao was founded to eliminate fluff and provide creators, developers, and tech entrepreneurs with production-grade digital tools. Instead of superficial courses that leave you stranded, every SmartBanao product is engineered by practicing software engineers and product designers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Real-World Practicality</h3>
              <p className="text-xs text-slate-600 mt-1">
                Zero theoretical filler. Tested codebases and proven proposal documents ready for immediate deployment.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">One-Time Ownership</h3>
              <p className="text-xs text-slate-600 mt-1">
                No subscription fatigue. Buy what you need, own it perpetually, and get updates as technology advances.
              </p>
            </div>
          </div>
        </article>
      )}

      {page === 'contact' && (
        <div className="space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Get In Touch</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Contact Customer Support</h1>
            <p className="text-xs text-slate-500 mt-1">We’re here to assist with purchases, licensing, and access.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4 text-xs text-slate-600">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Support Email</span>
                    <a href="mailto:support@smartbanao.com" className="text-sky-600 underline">
                      support@smartbanao.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Digital Ticketing Support</span>
                    <span>Direct priority queue for orders, licensing and downloads.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Response Time Guarantee</span>
                    <span>All inquiries responded to within 24 business hours.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              {submitted ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">Message Received!</h3>
                  <p className="text-xs text-slate-600">
                    Thank you for reaching out. Our support team has logged your inquiry and will follow up at {contactForm.email} shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-semibold text-emerald-700 underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="How can we assist you with SmartBanao?"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
