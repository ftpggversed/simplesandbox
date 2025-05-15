"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { Laptop, Menu, X } from "lucide-react";

type FontSize = "text-sm" | "text-base" | "text-lg";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fontSize, setFontSize] = useState<FontSize>("text-base");
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [syntaxTheme, setSyntaxTheme] = useState<string>("twilight");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Load saved settings
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light";
    const savedFont = localStorage.getItem("fontSize") as FontSize;
    const savedAuto = localStorage.getItem("autoRun");
    const savedSyntax = localStorage.getItem("syntaxTheme");
    if (savedTheme) setTheme(savedTheme);
    if (savedFont) setFontSize(savedFont);
    if (savedAuto !== null) setAutoRun(savedAuto === "true");
    if (savedSyntax) setSyntaxTheme(savedSyntax);
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);
  useEffect(() => {
    localStorage.setItem("autoRun", String(autoRun));
  }, [autoRun]);
  useEffect(() => {
    localStorage.setItem("syntaxTheme", syntaxTheme);
  }, [syntaxTheme]);

  const year = new Date().getFullYear();

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
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Home
              </Link>
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                About
              </Link>
              <Link href="/sandbox" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Sandbox
              </Link>
              <Link href="/settings" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-white transition">
                Settings
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Home</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</Link>
            <Link href="/sandbox" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Sandbox</Link>
            <Link href="/settings" className="block px-3 py-2 rounded-md text-base font-medium bg-gray-700 text-white">Settings</Link>
          </div>
        )}
      </nav>

      {/* Settings Content */}
      <main className="flex-1 p-6">
        <h1 className="text-4xl font-bold text-indigo-300 mb-8 text-center">
          Settings
        </h1>
        <div className="border border-indigo-300 text-indigo-300 p-3 rounded-md max-w-4xl mx-auto mb-6">
          <strong>Note:</strong> These settings are currently cosmetic and do
          not affect functionality yet.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Appearance Card */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label>Dark Theme</label>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                >
                  {theme === "dark" ? "On" : "Off"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label>Editor Font Size</label>
                <select
                  value={fontSize}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setFontSize(e.target.value as FontSize)
                  }
                  className="px-3 py-2 bg-gray-700 rounded-md"
                >
                  <option value="text-sm">Small</option>
                  <option value="text-base">Medium</option>
                  <option value="text-lg">Large</option>
                </select>
              </div>
            </div>
          </div>
          {/* Behavior Card */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Behavior</h2>
            <div className="flex items-center justify-between">
              <label>Auto-Run</label>
              <button
                onClick={() => setAutoRun(!autoRun)}
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
              >
                {autoRun ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
          {/* Syntax Highlighting Card */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Syntax Highlighting</h2>
            <div className="flex items-center justify-between">
              <label>Color Theme</label>
              <select
                value={syntaxTheme}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSyntaxTheme(e.target.value)
                }
                className="px-3 py-2 bg-gray-700 rounded-md"
              >
                <option value="twilight">Twilight</option>
                <option value="monokai">Monokai</option>
                <option value="github">GitHub</option>
                <option value="dracula">Dracula</option>
              </select>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © {year} Simple Sandbox. All rights reserved. test
        </div>
      </footer>
    </div>
  );
}
