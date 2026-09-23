'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Film,
  Search,
  Bookmark,
  User,
  Menu,
  X,
  Compass,
  Sparkles,
} from 'lucide-react';
import { useMovieContext } from '@/context/MovieContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { watchlist, isLoaded } = useMovieContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentCategory = searchParams.get('category');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, searchParams]);

  const navLinks = [
    { label: 'Home', href: '/', isActive: pathname === '/' },
    {
      label: 'Movies',
      href: '/movies',
      isActive: pathname === '/movies' && !currentCategory,
    },
    {
      label: 'Hindi',
      href: '/movies?category=hindi',
      isActive: pathname === '/movies' && currentCategory === 'hindi',
    },
    {
      label: 'English',
      href: '/movies?category=english',
      isActive: pathname === '/movies' && currentCategory === 'english',
    },
    {
      label: 'Bangla',
      href: '/movies?category=bangla',
      isActive: pathname === '/movies' && currentCategory === 'bangla',
    },
    {
      label: 'Hindi Dubbed',
      href: '/movies?category=hindi-dubbed',
      isActive: pathname === '/movies' && currentCategory === 'hindi-dubbed',
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3 shadow-2xl shadow-black/80'
            : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="group flex items-center gap-2.5 text-white font-extrabold text-xl tracking-wider select-none"
              >
                <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  <Film className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="tracking-tight font-black text-xl">
                  CINE<span className="text-neutral-400 font-light">BLACK</span>
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                      link.isActive
                        ? 'bg-white text-black font-semibold shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right cluster: Search, Watchlist, Profile, Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search button */}
              <Link
                href="/search"
                className={`p-2 rounded-full transition-colors text-neutral-300 hover:text-white hover:bg-neutral-900 ${
                  pathname === '/search' ? 'bg-neutral-800 text-white' : ''
                }`}
                title="Search movies"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Watchlist button with badge count */}
              <Link
                href="/watchlist"
                className={`relative p-2 rounded-full transition-colors text-neutral-300 hover:text-white hover:bg-neutral-900 ${
                  pathname === '/watchlist' ? 'bg-neutral-800 text-white' : ''
                }`}
                title="Your Watchlist"
                aria-label="Watchlist"
              >
                <Bookmark className="w-4 h-4" />
                {mounted && isLoaded && watchlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {watchlist.length}
                  </span>
                )}
              </Link>

              {/* Profile button */}
              <Link
                href="/profile"
                className={`flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full border transition-all text-xs font-medium ${
                  pathname === '/profile'
                    ? 'border-white bg-neutral-900 text-white'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/70 text-neutral-300 hover:text-white'
                }`}
                title="User Profile"
              >
                <div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
                  <User className="w-3 h-3" />
                </div>
                <span className="hidden sm:inline">Profile</span>
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-neutral-950/95 border-t border-neutral-900 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold px-2">
                Navigation
              </div>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      link.isActive
                        ? 'bg-white text-black font-semibold shadow-lg'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-neutral-900 pt-6">
                <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold px-2 mb-3">
                  Account & Shortcuts
                </div>
                <div className="space-y-2">
                  <Link
                    href="/watchlist"
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-900/60 text-sm text-neutral-200 hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Bookmark className="w-4 h-4" />
                      <span>My Watchlist</span>
                    </div>
                    {mounted && isLoaded && (
                      <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-xs font-mono">
                        {watchlist.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900/60 text-sm text-neutral-200 hover:text-white"
                  >
                    <User className="w-4 h-4" />
                    <span>Member Profile</span>
                  </Link>
                  <Link
                    href="/search"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900/60 text-sm text-neutral-200 hover:text-white"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Catalog</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-900 text-center text-xs text-neutral-500">
              <p className="font-semibold text-neutral-400">CineBlack Experience</p>
              <p className="mt-1">Black & White Cinema UI with Full Color Visuals</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
