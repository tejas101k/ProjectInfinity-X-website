// src/components/Header.tsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) { // md breakpoint
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Android Status Bar - Pure White */}
      <div className="fixed top-0 left-0 w-full h-1 z-50"></div>

      {/* Desktop Navigation - Pure Black */}
      <header className="bg-black py-4 px-4 md:px-8 z-40 sticky top-1 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              {/* Icon in White */}
              <div className="text-white text-2xl group-hover:text-gray-300 transition-colors">
                <i className="fas fa-infinity"></i>
              </div>
              {/* Text in White */}
              <div className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors">
                Project Infinity X
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {/* Links in White, hover slightly gray */}
              <Link href="/" className="text-white hover:text-gray-300 transition-colors font-medium">
                Home
              </Link>
              <Link href="/downloads" className="text-white hover:text-gray-300 transition-colors font-medium">
                Downloads
              </Link>
              <Link href="/apply-for-maintainership" className="text-white hover:text-gray-300 transition-colors font-medium">
                Apply For Maintainership
              </Link>
              <Link href="/legal" className="text-white hover:text-gray-300 transition-colors font-medium">
                Legal
              </Link>
            </div>
            {/* CTA Button - Inverted: Black text on White background, border White */}
            <a
              href="https://t.me/projectinfinityx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black bg-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-all font-medium border border-white"
            >
              <i className="fab fa-telegram-plane"></i> Telegram
            </a>
          </nav>
          {/* Mobile Menu Button - White text on Black */}
          <button
            id="mobileMenuToggle"
            className="md:hidden text-white text-xl p-2 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobileNavLinks"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </header>

      {/* Mobile Navigation - Pure Black */}
      <div
        id="mobileNavLinks"
        className={`fixed inset-0 bg-black z-30 pt-6 transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6 space-y-6 mt-20">
          {/* Mobile Nav Links - White text, hover gray, active background */}
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center p-3 rounded-lg hover:bg-gray-900 text-white hover:text-gray-300 transition-colors">
            <i className="fas fa-home mr-3 text-white"></i>
            <span className="text-lg">Home</span>
          </Link>
          <Link href="/downloads" onClick={() => setIsMenuOpen(false)} className="flex items-center p-3 rounded-lg hover:bg-gray-900 text-white hover:text-gray-300 transition-colors">
            <i className="fas fa-download mr-3 text-white"></i>
            <span className="text-lg">Downloads</span>
          </Link>
          <Link href="/apply-for-maintainership" onClick={() => setIsMenuOpen(false)} className="flex items-center p-3 rounded-lg hover:bg-gray-900 text-white hover:text-gray-300 transition-colors">
            <i className="fas fa-user-plus mr-3 text-white"></i>
            <span className="text-lg">Apply For Maintainership</span>
          </Link>
          <Link href="/legal" onClick={() => setIsMenuOpen(false)} className="flex items-center p-3 rounded-lg hover:bg-gray-900 text-white hover:text-gray-300 transition-colors">
            <i className="fas fa-gavel mr-3 text-white"></i>
            <span className="text-lg">Legal</span>
          </Link>
          {/* Telegram link - Inverted: Black text on White background */}
          <a
            href="https://t.me/projectinfinityx"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center p-3 rounded-lg bg-white text-black border border-white hover:bg-gray-200 transition-colors font-medium"
          >
            <i className="fab fa-telegram-plane mr-3"></i>
            <span className="text-lg">Telegram</span>
          </a>
        </div>
      </div>
    </>
  );
}