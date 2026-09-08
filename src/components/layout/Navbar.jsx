import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenSearch }) {
  return (
    <nav className="bg-white border-b sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-2xl text-pink-600 tracking-wide">
            বঙ্গ-শাড়ি
          </Link>

          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-pink-600 transition">হোম</Link>
            <Link to="/products" className="hover:text-pink-600 transition">শাড়ি কালেকশন</Link>
            <Link to="/ai-agent" className="flex items-center space-x-1 text-pink-600 font-semibold bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>AI Agent</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={onOpenSearch} className="p-2 text-gray-600 hover:text-pink-600">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="p-2 text-gray-600 hover:text-pink-600">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
