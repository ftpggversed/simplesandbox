'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      {/* Navigation */}
      <nav className="bg-gray-800 text-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 mr-4"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
              </button>
              <Link href="/" className="text-2xl font-bold text-indigo-300 hover:text-indigo-200 transition">
                Simple Sandbox
              </Link>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-white transition">
                Home
              </Link>
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                About
              </Link>
              <Link href="/sandbox" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Sandbox
              </Link>
              <Link href="/settings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Settings
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium bg-gray-700 text-white">Home</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</Link>
            <Link href="/sandbox" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Sandbox</Link>
            <Link href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Settings</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-extrabold text-indigo-300 mb-4">
          Welcome to Simple Sandbox
        </h1>
        <p className="text-xl text-gray-400 mb-6 max-w-2xl">
          An interactive playground for HTML, CSS, and JavaScript — experiment, learn, and share your code in real-time.
        </p>
        <Link href="/sandbox" className="inline-block px-6 py-3 bg-indigo-400 text-gray-900 font-semibold rounded-md hover:bg-indigo-300 transition">
          Launch Sandbox
        </Link>
      </header>

      {/* Footer */}
      <footer className="bg-gray-800 py-4 shadow-inner">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Simple Sandbox. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
