import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AssetAlyze - Professional Collectible Valuations',
  description: 'Get accurate valuations for art, antiques, jewelry, and collectibles using AI technology and expert authentication. Professional appraisals you can trust.',
  keywords: 'collectible valuation, art appraisal, antique evaluation, jewelry assessment, watch valuation, professional appraisal',
  authors: [{ name: 'AssetAlyze' }],
  creator: 'AssetAlyze',
  publisher: 'AssetAlyze',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://assetalyze.com'),
  openGraph: {
    title: 'AssetAlyze - Professional Collectible Valuations',
    description: 'Get accurate valuations for art, antiques, jewelry, and collectibles using AI technology and expert authentication.',
    url: 'https://assetalyze.com',
    siteName: 'AssetAlyze',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AssetAlyze - Professional Collectible Valuations',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AssetAlyze - Professional Collectible Valuations',
    description: 'Get accurate valuations for art, antiques, jewelry, and collectibles using AI technology and expert authentication.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_here',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}