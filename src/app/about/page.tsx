
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Laptop, Menu, X, Code, Share2, Download } from 'lucide-react';

export default function AboutPage() {
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
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Home
              </Link>
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-white transition">
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
          {mobileOpen && (
            <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-1">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Home
              </Link>
              <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium bg-gray-700 text-white">
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
        </div>
      </nav>

      {/* About Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-16">
        <Laptop className="w-12 h-12 text-indigo-300 mb-4" />
        <h1 className="text-4xl font-bold mb-4 text-indigo-300">About Simple Sandbox</h1>
        <p className="text-lg text-gray-400 max-w-2xl mb-6">
          Simple Sandbox is a lightweight, client-side code playground built with React, Next.js, and Tailwind CSS.
          Experiment with HTML, CSS, and JavaScript in real time, then download your files or share your creations with ease.
        </p>
        <p className="text-gray-400 max-w-2xl mb-12">
          Whether you&apos;re learning web development or prototyping a quick idea, Simple Sandbox provides an
          interactive environment to write, run, and debug code directly in your browser.
        </p>

        {/* FAQ Section */}
        <section className="w-full max-w-4xl mt-16 text-left">
          <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-xl text-indigo-300 mb-2">Does Simple Sandbox store my code?</h3>
              <p className="text-gray-400">No, all code runs locally in your browser unless you choose to save it or share via URL.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-xl text-indigo-300 mb-2">Can I work offline?</h3>
              <p className="text-gray-400">Yes, after the initial load, you can continue coding without an internet connection.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-xl text-indigo-300 mb-2">How do I share my sandbox?</h3>
              <p className="text-gray-400">Click the share icon in the sandbox toolbar to generate a unique URL you can send to others.</p>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="w-full max-w-4xl mt-16">
          <h2 className="text-2xl font-semibold text-white mb-6">Built With</h2>
          <div className="flex justify-center flex-wrap gap-8">
            <span className="px-4 py-2 bg-gray-800 rounded-lg">React</span>
            <span className="px-4 py-2 bg-gray-800 rounded-lg">Next.js</span>
            <span className="px-4 py-2 bg-gray-800 rounded-lg">Tailwind CSS</span>
            <span className="px-4 py-2 bg-gray-800 rounded-lg">TypeScript</span>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full max-w-4xl mt-16">
          <h2 className="text-2xl font-semibold text-white mb-4">Join Us</h2>
          <p className="text-gray-400 mb-6">Start exploring code today and be part of our community!</p>
          <Link href="/sandbox" className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-md shadow-lg transition">
            Try Sandbox Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Simple Sandbox. All rights reserved.
        </div>
      </footer>
    </div>
  );
}