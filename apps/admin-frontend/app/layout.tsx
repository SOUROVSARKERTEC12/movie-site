import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AdminSidebar } from '@/components/AdminSidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CineBlack Ops — Cinema Streaming Operations & Telemetry Dashboard',
  description:
    'Internal operations, streaming telemetry, live user monitoring, and content analytics dashboard for CineBlack.',
  icons: {
    icon: '/favicon.svg',
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
        className="min-h-full flex bg-[#050505] text-[#f5f5f5]"
      >
        <AdminSidebar />
        <div className="flex-1 flex flex-col lg:pl-64 w-full min-h-screen pt-14 lg:pt-0">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
