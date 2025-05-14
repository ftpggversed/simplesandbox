import Link from 'next/link';
import { Laptop } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      
      {/* Navigation */}
      <nav className="bg-gray-800 text-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-indigo-300 hover:text-indigo-200 transition">
                Simple Sandbox
              </Link>
            </div>
            <div className="flex space-x-4">
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
        </div>
      </nav>

      {/* About Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-16">
        <h1 className="text-4xl font-bold mb-4 text-indigo-300">About Simple Sandbox</h1>
        <p className="text-lg text-gray-400 max-w-2xl mb-6">
          Simple Sandbox is a lightweight, client-side code playground built with React, Next.js, and Tailwind CSS.
          Experiment with HTML, CSS, and JavaScript in real time, then download your files or share your creations with ease.
        </p>
        <p className="text-gray-400 max-w-2xl">
          Whether you&apos;re learning web development or prototyping a quick idea, Simple Sandbox provides an
          interactive environment to write, run, and debug code directly in your browser.
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-4 shadow-inner">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Simple Sandbox. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
