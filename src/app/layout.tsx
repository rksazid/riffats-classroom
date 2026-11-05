import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Riffat's Classroom — Learn English. Build Confidence. Shine Brighter.",
  description:
    "A modern, friendly digital classroom and Learning Management System for English grammar mastery, daily challenges, recorded courses, and school exam preparation.",
  keywords: [
    "English Grammar",
    "Riffat's Classroom",
    "Bangladesh School English",
    "Daily Grammar Challenge",
    "Class 6 English",
    "Class 7 English",
    "Class 8 English",
    "Sentence Building",
    "Articles A An The",
    "Demra Dhaka"
  ],
  authors: [{ name: "Riffat Nasrin" }],
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0c4a4e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-pink-100 selection:text-pink-700">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
