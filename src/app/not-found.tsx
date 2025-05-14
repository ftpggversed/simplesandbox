import Link from 'next/link';
import { Laptop } from 'lucide-react';

export default function NotFoundPage() {
  const year = new Date().getFullYear();

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
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                About
              </Link>
              <Link href="/sandbox"  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Sandbox
              </Link>
              <Link href="/settings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <div className="text-9xl mb-4 transform animate-bounce text-indigo-400">🤖</div>
        <h1 className="text-6xl font-extrabold mb-2 text-gray-100">404</h1>
        <p className="text-lg text-gray-400 mb-6 max-w-lg">
          This is not the link you&apos;re looking for.
          <br />Return to the sandbox or explore the realms of code.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition"
          >
            Return Home
          </Link>
          <Link
            href="/sandbox"
            className="inline-block px-6 py-3 border border-indigo-400 text-indigo-300 font-semibold rounded-md hover:bg-indigo-700 hover:text-white transition"
          >
            Launch Sandbox
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-4">
        <div className="max-w-5xl mx-auto text-center text-gray-500 text-sm">
          © {year} Simple Sandbox. All rights reserved. Built with 💜 by coders.
        </div>
      </footer>
    </div>
  );
}
