'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200">

      {/* Navigation */}
      <nav className="bg-gray-800 text-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 mr-4"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
        {mobileOpen && (
          <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium bg-gray-700 text-white">
              Home
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
              About
            </Link>
            <Link href="/sandbox" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
              Sandbox
            </Link>
            <Link href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
              Settings
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section with split layout */}
      <header className="relative flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-24 overflow-hidden">
        {/* Text Content */}
        <div className="relative z-10 max-w-lg text-left space-y-6">
          <h1 className="text-5xl font-extrabold text-white">
            Dive into Your Code Sandbox
          </h1>
          <p className="text-lg text-gray-400">
            Unleash your creativity with our live HTML, CSS, and JavaScript playground.
            Write code, see instant previews, and share your work effortlessly.
          </p>
          <div className="flex space-x-4">
            <Link href="/sandbox" className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-md shadow-lg transition">
              Get Started
            </Link>
            <Link href="/about" className="px-6 py-3 border border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-md transition">
              Learn More
            </Link>
          </div>
        </div>
        {/* Code Preview Mockup */}
        <div className="relative z-10 mt-12 lg:mt-0 lg:ml-12 w-full max-w-md border-2 border-gray-700 rounded-lg overflow-hidden shadow-xl">
          <div className="bg-gray-900 px-4 py-2">
            <div className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <div className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <div className="inline-block w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 text-sm font-mono h-64 overflow-auto">
{`<html>
  <body>
    <h1>Hello, Sandbox!</h1>
  </body>
</html>`}
          </pre>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:scale-105 transform transition">
              <h3 className="text-xl font-semibold text-indigo-300 mb-2">Live Preview</h3>
              <p className="text-gray-400">See changes instantly as you code, without manual refreshes.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:scale-105 transform transition">
              <h3 className="text-xl font-semibold text-indigo-300 mb-2">Code Sharing</h3>
              <p className="text-gray-400">Share your sandbox with a unique URL for easy collaboration.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:scale-105 transform transition">
              <h3 className="text-xl font-semibold text-indigo-300 mb-2">Download Projects</h3>
              <p className="text-gray-400">Export your code files or a ZIP archive with one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action (no background) */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to start coding?</h2>
          <Link href="/sandbox" className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-md shadow-lg transition">
            Open Sandbox Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Simple Sandbox. All rights reserved.
        </div>
      </footer>
    </div>
  );
}