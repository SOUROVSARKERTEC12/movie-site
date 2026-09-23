import React from 'react';
import Link from 'next/link';
import { Film, ShieldCheck, Tv, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-900 bg-black text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white font-extrabold text-lg tracking-wider"
            >
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-black">
                <Film className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="font-black text-lg">
                CINE<span className="text-neutral-500 font-light">BLACK</span>
              </span>
            </Link>
            <p className="text-neutral-400 leading-relaxed text-xs">
              A minimalist, high-contrast cinema streaming interface engineered
              with Next.js and TypeScript. OLED black aesthetic framing colorful
              world cinema.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Demo Streaming Network Online</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/movies?category=hindi"
                  className="hover:text-white transition-colors"
                >
                  Hindi Cinema (Bollywood)
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?category=english"
                  className="hover:text-white transition-colors"
                >
                  English Cinema (Hollywood)
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?category=bangla"
                  className="hover:text-white transition-colors"
                >
                  Bangla Cinema (Dhallywood)
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?category=hindi-dubbed"
                  className="hover:text-white transition-colors"
                >
                  Hindi Dubbed Blockbusters
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Spotlight
                </Link>
              </li>
              <li>
                <Link
                  href="/movies"
                  className="hover:text-white transition-colors"
                >
                  Full Movie Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="hover:text-white transition-colors"
                >
                  Instant Search
                </Link>
              </li>
              <li>
                <Link
                  href="/watchlist"
                  className="hover:text-white transition-colors"
                >
                  Personal Watchlist
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-white transition-colors"
                >
                  Member Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Standards & Specs */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase">
              Technology & Specs
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-neutral-400">
                <Tv className="w-4 h-4 text-white" />
                <span>4K Ultra HD & HDR10 Demo Playback</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Client-Side Local Storage Synchronization</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Next.js 16 App Router & React 19</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© {new Date().getFullYear()} CineBlack. Designed with a pure Black & White aesthetic.</p>
          <p className="text-center sm:text-right">
            Frontend demonstration project. Video streams use public open-source demo media.
          </p>
        </div>
      </div>
    </footer>
  );
};
