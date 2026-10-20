import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Leaf,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Lock,
  Eye,
  Flag,
  Apple,
  Cpu,
  Flame,
  MessageSquare,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  HeartHandshake,
  Wrench,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { createSupportRequest } from '../services/adminService';
import { useAuth } from '../context/AuthContext';

export function AboutPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'about', 'safety', 'support'

  // Contact Support Form State
  const [name, setName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      await createSupportRequest({
        userId: user?.id || null,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      setSubmitted(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      setFormError(err.message || 'Failed to submit support request.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How does ReLoop work?',
      a: 'ReLoop connects people with surplus materials (timber, furniture, electronics, fabric, pantry food) to makers, workshops, charities, and neighbors. Post what you have or what you need, chat directly in-app, and collect locally.'
    },
    {
      q: 'Does ReLoop charge fees or commissions?',
      a: 'No. ReLoop is free for community members. Free giveaways, charity donations, direct sales, and material exchanges are arranged directly between users.'
    },
    {
      q: 'Can I offer food on ReLoop?',
      a: 'Only sealed pantry foods, bakery surplus, and fresh garden harvest are permitted. Spoiled, expired, or unhygienic food is strictly forbidden.'
    },
    {
      q: 'How do I report a suspicious post or user?',
      a: 'Every listing includes a Report button. You can also send a direct inquiry to our moderation team using the support form at the bottom of this page.'
    }
  ];

  return (
    <div className="min-h-screen bg-offwhite py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Page Hero Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-bold border border-forest-200">
            <Recycle className="w-4 h-4 text-forest-600" />
            <span>About ReLoop, Safety & Support Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal-900 tracking-tight">
            One Resource, Many Possibilities
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-normal">
            Everything you need to know about our circular economy mission, safety standards, and reaching out for support.
          </p>

          {/* Quick Filter Tabs */}
          <div className="inline-flex p-1 bg-charcoal-100/80 rounded-2xl text-xs font-bold text-charcoal-600 gap-1 mt-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'all' ? 'bg-white text-charcoal-900 shadow-xs' : 'hover:text-charcoal-900'}`}
            >
              All Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'about' ? 'bg-white text-charcoal-900 shadow-xs' : 'hover:text-charcoal-900'}`}
            >
              About Platform
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('safety')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'safety' ? 'bg-white text-charcoal-900 shadow-xs' : 'hover:text-charcoal-900'}`}
            >
              Safety Rules
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('support')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'support' ? 'bg-white text-charcoal-900 shadow-xs' : 'hover:text-charcoal-900'}`}
            >
              Contact & Support
            </button>
          </div>
        </div>

        {/* SECTION 1: ABOUT RELOOP */}
        {(activeTab === 'all' || activeTab === 'about') && (
          <section className="space-y-8 animate-in fade-in duration-200">
            {/* The Problem & Solution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-charcoal-100 shadow-xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  The Problem
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal-900">
                  Valuable Materials Go to Waste
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                  Every single day, construction offcuts, surplus furniture, working electronics, fabric bolts, and compostable organic matter are thrown into landfills simply because there hasn't been an easy local way to connect them with people who need them.
                </p>
              </div>

              <div className="bg-forest-900 text-white p-7 sm:p-8 rounded-3xl border border-forest-800 shadow-xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-fresh-400">
                  The Solution
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Local Circular Exchange
                </h2>
                <p className="text-xs sm:text-sm text-forest-200 leading-relaxed">
                  ReLoop connects individuals, makers, charities, and recyclers. By giving resources a second life, we reduce community waste, lower transit carbon, and build direct neighborhood connections.
                </p>
              </div>
            </div>

            {/* Circular Pathways */}
            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-charcoal-100 shadow-xs space-y-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-1">
                  Circular Pathways
                </h2>
                <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal-900">
                  Six Ways Every Resource Finds a Purpose
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
                  <strong className="text-forest-800 text-sm block mb-1">1. Direct Reuse</strong>
                  <p className="text-charcoal-600 text-xs leading-relaxed">Pass items along in good shape without extra processing.</p>
                </div>
                <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
                  <strong className="text-forest-800 text-sm block mb-1">2. Charity Donation</strong>
                  <p className="text-charcoal-600 text-xs leading-relaxed">Gift usable surplus directly to community non-profits and shelters.</p>
                </div>
                <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
                  <strong className="text-forest-800 text-sm block mb-1">3. Repair & Clinic Fixes</strong>
                  <p className="text-charcoal-600 text-xs leading-relaxed">Pair salvageable appliances with local technicians and learners.</p>
                </div>
                <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
                  <strong className="text-forest-800 text-sm block mb-1">4. Repurposing & Upcycling</strong>
                  <p className="text-charcoal-600 text-xs leading-relaxed">Transform scrap denim, offcut timber, or containers into creative projects.</p>
                </div>
                <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
                  <strong className="text-forest-800 text-sm block mb-1">5. Material Recycling</strong>
                  <p className="text-charcoal-600 text-xs leading-relaxed">Route clean metals, cardboard, and clean polymers to certified recyclers.</p>
                </div>
                <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
                  <strong className="text-forest-800 text-sm block mb-1">6. Organic Composting</strong>
                  <p className="text-charcoal-600 text-xs leading-relaxed">Convert food prep scraps, coffee grounds, and floral stems into rich soil.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: SAFETY GUIDELINES */}
        {(activeTab === 'all' || activeTab === 'safety') && (
          <section className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <Ban className="w-7 h-7 text-rose-600 shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-rose-950">
                  Community Safety Guidelines & Prohibited Items
                </h2>
                <p className="text-xs text-rose-700">Strict rules to keep every exchange transparent and safe.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-rose-900">
              <div className="bg-white/95 p-4 rounded-2xl border border-rose-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-rose-950">
                  <Apple className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Zero Spoiled Food</span>
                </div>
                <p className="leading-relaxed text-xs">
                  Expired, moldy, or unhygienic food must <strong>NEVER</strong> be shared. Only sealed pantry items and fresh garden produce are allowed.
                </p>
              </div>

              <div className="bg-white/95 p-4 rounded-2xl border border-rose-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-rose-950">
                  <Flame className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>No Hazardous Chemicals</span>
                </div>
                <p className="leading-relaxed text-xs">
                  Pesticides, toxic solvents, asbestos, and unlabelled chemical containers are strictly prohibited from exchange.
                </p>
              </div>

              <div className="bg-white/95 p-4 rounded-2xl border border-rose-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-rose-950">
                  <Cpu className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Damaged Batteries & E-Waste</span>
                </div>
                <p className="leading-relaxed text-xs">
                  Swollen or leaking lithium batteries must not be exchanged curbside. Hazardous e-waste must be taken to authorized depots.
                </p>
              </div>

              <div className="bg-white/95 p-4 rounded-2xl border border-rose-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-rose-950">
                  <Eye className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Inspect in Person</span>
                </div>
                <p className="leading-relaxed text-xs">
                  Always inspect items in person to verify quality, quantity, and working condition before taking them.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: FREQUENTLY ASKED QUESTIONS */}
        {(activeTab === 'all' || activeTab === 'support') && (
          <section className="bg-white p-7 sm:p-9 rounded-3xl border border-charcoal-100 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-forest-600" />
              <h2 className="text-xl font-bold text-charcoal-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-charcoal-100">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-charcoal-800 hover:text-forest-700 transition"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-forest-600 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-charcoal-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <p className="mt-2 text-xs text-charcoal-600 leading-relaxed bg-offwhite p-3 rounded-xl border border-charcoal-100">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: CONTACT & SUPPORT TICKET FORM */}
        {(activeTab === 'all' || activeTab === 'support') && (
          <section className="bg-white p-7 sm:p-9 rounded-3xl border border-charcoal-100 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal-900">
                  Contact Support & Moderation Team
                </h2>
                <p className="text-xs text-charcoal-500">
                  Have a question, feedback, or need help with a listing? Send us a message.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-950">Thank you! Your ticket has been received.</h3>
                <p className="text-xs text-emerald-800">
                  Our moderation team will review your inquiry and follow up at your email address.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-emerald-900 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-700 font-bold mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-bold mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="E.g., Listing question, safety concern, or account support"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can help you..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}</span>
                </button>
              </form>
            )}
          </section>
        )}

        {/* Quick Link to Browse */}
        <div className="text-center pt-2">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-700 text-white font-bold text-xs sm:text-sm hover:bg-forest-800 transition shadow-md"
          >
            <span>Explore Live Resources on ReLoop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
