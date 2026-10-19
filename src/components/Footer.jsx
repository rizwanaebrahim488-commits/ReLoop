import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShieldCheck, MapPin, Heart, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../utils/categories';

export function Footer() {
  return (
    <footer className="bg-forest-950 text-forest-100 border-t border-forest-900 mt-20">
      {/* Important Business Rule Disclaimer Banner */}
      <div className="bg-forest-900/60 border-b border-forest-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-forest-200">
            <AlertCircle className="w-5 h-5 text-fresh-400 shrink-0" />
            <span>
              <strong>Direct Collection Policy:</strong> ReLoop does not provide delivery services or delivery partners. Users communicate directly to inspect items and independently coordinate collection and transport.
            </span>
          </div>
          <Link
            to="/safety-and-guidelines"
            className="text-fresh-300 hover:text-white underline font-medium shrink-0"
          >
            Read Community Safety Rules
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-md">
                <Recycle className="w-5 h-5 text-fresh-300" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Re<span className="text-fresh-400">Loop</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed max-w-sm">
              One Resource, Many Possibilities. Connecting individuals, makers, workshops, charities, and recyclers to divert usable resources from premature landfills into circular second lives.
            </p>

            <div className="flex flex-col gap-1.5 pt-2 text-xs text-forest-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-fresh-400" />
                <span>Zero fake statistics — Real recorded platform data</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-fresh-400" />
                <span>Google Maps enabled with privacy protection</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore ReLoop
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-forest-200">
              <li>
                <Link to="/resources" className="hover:text-white transition">
                  Browse Resources
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  All 13 Categories
                </Link>
              </li>
              <li>
                <Link to="/needs/create" className="hover:text-white transition">
                  Publish a Need
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">
                  How Matching Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Next Best Use Concept
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Highlights */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Popular Materials
            </h4>
            <ul className="space-y-2 text-xs text-forest-200">
              {CATEGORIES.slice(0, 6).map(c => (
                <li key={c.id}>
                  <Link to={`/resources?category=${encodeURIComponent(c.name)}`} className="hover:text-white transition">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety & Trust */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Trust & Security
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-forest-200">
              <li>
                <Link to="/safety-and-guidelines" className="hover:text-white transition">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Register as Workshop / NGO
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-400 gap-4">
          <p>© {new Date().getFullYear()} ReLoop Circular Ecosystem. Designed for waste prevention.</p>
          <div className="flex items-center space-x-6">
            <Link to="/safety-and-guidelines" className="hover:text-forest-200">Terms & Safety</Link>
            <Link to="/about" className="hover:text-forest-200">Circular Charter</Link>
            <Link to="/contact" className="hover:text-forest-200">Report an Issue</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
