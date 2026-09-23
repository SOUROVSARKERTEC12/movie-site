import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MovieProvider } from '@/context/MovieContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CineBlack — Modern Cinema & World Movie Streaming',
  description:
    'Experience Hindi, Hollywood, Bangla, and Hindi Dubbed masterpieces in an OLED Black & White cinematic interface.',
  keywords: [
    'movies',
    'streaming',
    'cinema',
    'hindi movies',
    'bangla movies',
    'hindi dubbed',
    'hollywood',
    'cineblack',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-black text-white`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#050505] text-[#f5f5f5]"
      >
        <MovieProvider>
          <Suspense fallback={<div className="h-16 bg-black" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow pt-16">{children}</main>
          <Footer />
        </MovieProvider>
      </body>
    </html>
  );
}
