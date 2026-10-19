import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { createSupportRequest } from '../services/adminService';
import { useAuth } from '../context/AuthContext';

export function ContactPage() {
  const { user, profile } = useAuth();

  const [name, setName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
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
      setError(err.message || 'Failed to submit support request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-forest-600" />
            <span>Community Help & Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Contact & Support
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed max-w-xl mx-auto">
            Have questions about circular categories, account verification, or need assistance? Submit your inquiry directly to our support database.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-charcoal-100 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-charcoal-900">Support Ticket Logged</h2>
              <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting ReLoop. Your ticket has been recorded in our support management system. Our moderation team will review your inquiry.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-forest-700 text-white text-xs font-semibold hover:bg-forest-800 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.org"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about workshop account verification"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide clear details regarding your inquiry..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition disabled:opacity-50 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Support Ticket...' : 'Submit Support Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
